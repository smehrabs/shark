import { useCallback, useEffect, useRef, useState } from 'react'
import type { PlayerState, Track } from '../types'

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  volume: 0.85,
  queue: [],
  queueIndex: -1
}

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<PlayerState>(initialState)

  useEffect(() => {
    const audio = new Audio()
    audio.volume = initialState.volume
    audioRef.current = audio

    const onTimeUpdate = (): void => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }))
    }

    const onEnded = (): void => {
      setState((prev) => {
        const nextIndex = prev.queueIndex + 1
        if (nextIndex < prev.queue.length) {
          const nextTrack = prev.queue[nextIndex]
          audio.src = window.api.getMediaUrl(nextTrack.filePath)
          void audio.play()
          return {
            ...prev,
            currentTrack: nextTrack,
            queueIndex: nextIndex,
            isPlaying: true,
            currentTime: 0
          }
        }
        return { ...prev, isPlaying: false, currentTime: 0 }
      })
    }

    const onPlay = (): void => setState((prev) => ({ ...prev, isPlaying: true }))
    const onPause = (): void => setState((prev) => ({ ...prev, isPlaying: false }))

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const playTrack = useCallback((track: Track, queue: Track[] = [track], index = 0) => {
    const audio = audioRef.current
    if (!audio) return

    audio.src = window.api.getMediaUrl(track.filePath)
    void audio.play()
    setState((prev) => ({
      ...prev,
      currentTrack: track,
      queue,
      queueIndex: index,
      isPlaying: true,
      currentTime: 0
    }))
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !state.currentTrack) return

    if (state.isPlaying) {
      audio.pause()
    } else {
      void audio.play()
    }
  }, [state.currentTrack, state.isPlaying])

  const playNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.queueIndex + 1
      if (nextIndex >= prev.queue.length) return prev

      const nextTrack = prev.queue[nextIndex]
      const audio = audioRef.current
      if (audio) {
        audio.src = window.api.getMediaUrl(nextTrack.filePath)
        void audio.play()
      }

      return {
        ...prev,
        currentTrack: nextTrack,
        queueIndex: nextIndex,
        isPlaying: true,
        currentTime: 0
      }
    })
  }, [])

  const playPrevious = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.currentTime > 3) {
      audio.currentTime = 0
      setState((prev) => ({ ...prev, currentTime: 0 }))
      return
    }

    setState((prev) => {
      const prevIndex = prev.queueIndex - 1
      if (prevIndex < 0) return prev

      const prevTrack = prev.queue[prevIndex]
      audio.src = window.api.getMediaUrl(prevTrack.filePath)
      void audio.play()

      return {
        ...prev,
        currentTrack: prevTrack,
        queueIndex: prevIndex,
        isPlaying: true,
        currentTime: 0
      }
    })
  }, [])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setState((prev) => ({ ...prev, currentTime: time }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current
    const clamped = Math.max(0, Math.min(1, volume))
    if (audio) audio.volume = clamped
    setState((prev) => ({ ...prev, volume: clamped }))
  }, [])

  return {
    ...state,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume
  }
}

export type UsePlayerReturn = ReturnType<typeof usePlayer>
