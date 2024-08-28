// NativeExample.c
#include <jni.h>
#include <stdio.h>
#include "NativeExample.h"

// 实现 native 方法
JNIEXPORT jstring JNICALL Java_NativeExample_getNativeMessage(JNIEnv *env, jobject obj) {
    return (*env)->NewStringUTF(env, "Hello from native code");
}