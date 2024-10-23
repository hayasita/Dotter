#ifndef VER_H
#define VER_H

#ifdef GLOBAL_VAL_DEF
#define GLOBAL
#else
#define GLOBAL extern
#endif

#define SW_VERSION_MAJOR 1
#define SW_VERSION_MINOR 0
#define SW_VERSION_PATCH 0

#define STRINGIFY(x) #x
#define TOSTRING(x) STRINGIFY(x)

//#define SW_VERSION_STR "v" TOSTRING(SW_VERSION_MAJOR) "." TOSTRING(SW_VERSION_MINOR) "." TOSTRING(SW_VERSION_PATCH)
#define SW_VERSION_STR "v0.1.0"

#undef GLOBAL
#endif // VER_H