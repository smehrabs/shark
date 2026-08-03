#include <napi.h>
#include <filesystem>

namespace fs = std::filesystem;

Napi::Value ListDirectory(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString())
        return env.Null();

    std::string path = info[0].As<Napi::String>();

    Napi::Array result = Napi::Array::New(env);

    uint32_t index = 0;

    for (const auto& entry : fs::directory_iterator(path))
    {
        Napi::Object obj = Napi::Object::New(env);

        obj.Set("name", entry.path().filename().string());
        obj.Set("path", entry.path().string());
        obj.Set("isDirectory", entry.is_directory());

        result[index++] = obj;
    }

    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(
        "listDirectory",
        Napi::Function::New(env, ListDirectory)
    );

    return exports;
}

NODE_API_MODULE(shark_native, Init)