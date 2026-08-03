{
  "targets": [
    {
      "target_name": "shark_native",

      "sources": [
        "src/addon.cpp"
      ],

      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],

      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],

      "cflags!": [
        "-fno-exceptions"
      ],

      "cflags_cc!": [
        "-fno-exceptions"
      ],

      "cflags_cc": [
        "-std=c++20",
        "-fexceptions"
      ],

      "defines": [
        "NAPI_CPP_EXCEPTIONS"
      ]
    }
  ]
}