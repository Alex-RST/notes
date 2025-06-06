#include<stdio.h>
#include<stdbool.h>
#include<stdlib.h>
#include<time.h>

typedef enum sort_way {
    INSERTION,
    SELECTION,
    SHELL,
    BUBBLE,
    QUICK,
    HEAP,
    MERGE
} sort_way;

typedef enum sort_order {
    ASC,
    DESC
}sort_order;

void output(int *array, int length);
void swap(int *i, int *j);
void reversed(int *array, int length);
void random_array(int *array, int length, int min, int max);
void array_copy(int *src, int *target, int length);
void test_sort_time(int *array, int length, void(*fun)(int*, int, sort_order));
void sort_compare(int *array, int length);

void insertion_sort(int *array, int length, sort_order isReversed);
void selection_sort(int *array, int length, sort_order isReversed);
void shell_sort(int *array, int length, sort_order isReversed);
void bubble_sort(int *array, int length, sort_order isReversed);
void quick_sort(int *array, int length, sort_order isReversed);
void quick_sort_realize(int *array, int start, int end);
void heap_sort(int *array, int length, sort_order isReversed);
void creat_heap(int *array, int length);
void adjust_heap(int *array, int start, int end);
void merge_sort(int *array, int length, sort_order isReversed);
void merge(int *array, int start, int mid, int end, int *temp);

#define LENGTH 50000
#define RANDOM_MIN 0
#define RANDOM_MAX 1000

int array[LENGTH] = {0};

int main() {
    random_array(array, LENGTH, RANDOM_MIN, RANDOM_MAX);
    test_sort_time(array, LENGTH, merge_sort);
    return 0;
}

/**
 * @brief 归并排序（二路归并）
 * @param array 数组
 * @param length 长度
 * @param isReversed 顺序
 */
void merge_sort(int *array, int length, sort_order isReversed) {
    int *temp = (int *)malloc(sizeof(int)*length);
    merge(array, 0, length/2, length, temp);
    if(isReversed == DESC) reversed(array, length);
    free(temp);
}
void merge(int *array, int start, int mid, int end, int *temp) {
    if(start < mid) {
        merge(array, start, start+(mid-start)/2, mid, temp);
        merge(array, mid, mid+(end-mid)/2, end, temp);
        int i = start, j = mid, k = start;
        while(i < mid && j < end) {
            if(array[i] < array[j]) {
                temp[k] = array[i];
                i++;
            }else {
                temp[k] = array[j];
                j++;
            }
            k++;
        }
        if(i < mid) while(i < mid) temp[k++] = array[i++];
        if(j < end) while(j < end) temp[k++] = array[j++];
        for(int z = start ; z < end ; z++) array[z] = temp[z];
    }
}

/**
 * @brief 堆排序
 * @param array 数组
 * @param length 数组长度
 * @param isReversed 顺序
*/
void heap_sort(int *array, int length, sort_order isReversed) {
    creat_heap(array, length);
    swap(array, array+length-1);
    for(int i = length-2 ; i > 0 ; i--) {
        adjust_heap(array, 0, i);
        swap(array, array+i);
    }
    if(isReversed == DESC) reversed(array, length);
}
void creat_heap(int *array, int length) {
    for(int i = length/2 ; i>=0 ; i--) {
        adjust_heap(array,  i, length-1);
    }
}
void adjust_heap(int *array, int start, int end) {
    int t = array[start], f = start;
    for(int c = start*2+1 ; c <= end ; c=c*2+1) {
        if(c < end && array[c] < array[c+1]) c++;
        if(array[c] <= t) break;
        array[f] = array[c];
        f = c;
    }
    array[f] = t;
}

/**
 * @brief 快速排序
 * @param array 数组
 * @param length 数组长度
 * @param isReversed 顺序
*/
void quick_sort(int *array, int length, sort_order isReversed) {
    quick_sort_realize(array, 0, length - 1);
    if(isReversed == DESC) reversed(array, length);
}
void quick_sort_realize(int *array, int start, int end) {
    if(start < end) {
        int i = start, j = end, t = array[start];
        while(i<j) {
            while(array[j] >= t && i < j) {
                j--;
            }
            array[i] = array[j];
            while(array[i] <= t && i < j) {
                i++;
            }
            array[j] = array[i];
        }
        array[j] = t;
        quick_sort_realize(array, start, i-1);
        quick_sort_realize(array, i+1, end);
    }
}

/**
 * @brief 希尔排序
 * @param array 数组
 * @param length 数组长度
 * @param isReversed 顺序
*/
void shell_sort(int *array, int length, sort_order isReversed) {
    for(int k = length/2 ; k > 0 ; k/=2) {
        for(int i = k ; i < length ; i++) {
            int t = array[i];
            int j = i-k;
            for( ; j >= 0 ; j-=k) {
                if(array[j] > t) {
                    array[j+k] = array[j];
                }else {
                    break;
                }
            }
            array[j+k] = t;
        }
    }
    if(isReversed == DESC) reversed(array, length);
}

/**
 * @brief 选择排序
 * @param array 数组
 * @param length 数组长度
 * @param isReversed 顺序
*/
void selection_sort(int *array, int length, sort_order isReversed) {
    for(int i = length-1 ; i > 0 ; i--) {
        int index = 0;
        for(int j = 1 ; j <= i ; j++) {
            index = array[j] > array[index] ? j : index;
        }
        swap(array+index, array+i);
    }
    if(isReversed == DESC) reversed(array, length);
}

/**
 * @brief 冒泡排序
 * @param array 数组
 * @param length 数组长度
 * @param isReversed 顺序
*/
void bubble_sort(int *array, int length, sort_order isReversed) {
    for(int i = length-1 ; i > 0 ; i--) {
        for(int j = 0 ; j < i ; j++) {
            if(array[j] > array[j+1]) {
                swap(array+j, array+j+1);
            }
        }
    }
    if(isReversed == DESC) reversed(array, length);
}

/**
 * @brief 直接插入排序
 * @param array 数组
 * @param length 数组长度
 * @param isReversed 顺序
*/
void insertion_sort(int *array, int length, sort_order isReversed) {
    for(int i = 1 ; i < length ; i++) {
        int t = array[i];
        int j = i-1;
        for( ; j >= 0 ; j--) {
            if(array[j] > t) {
                array[j+1] = array[j];
            }else {
                break;
            }
        }
        array[j+1] = t;
    }
    if(isReversed == DESC) reversed(array, length);
}

/**
 * @brief 堆排序
 * @param i 变量地址
 * @param j 变量地址
*/
void swap(int *i, int *j) {
    int t = *i;
    *i = *j;
    *j = t;
}

/**
 * @brief 反转
 * @param array 数组
 * @param length 长度
 */
void reversed(int *array, int length) {
    for(int i = 0 ; i <= (length-1)/2 ; i++) {
        swap(array+i, array+length-1-i);
    }
}

/**
 * @brief 输出
 * @param array 数组
 * @param length 长度
 */
void output(int *array, int length) {
    for(int i = 0 ; i < length ; i++) {
        printf("%d ", array[i]);
    }
}

/**
 * @brief 为数组生成随机数
 * @param array 数组
 * @param length 长度
 * @param min 最小值
 * @param max 最大值
 */
void random_array(int *array, int length, int min, int max) {
    for(int i = 0 ; i < length ; i++) {
        array[i] = rand()%(max-min+1) + min;
    }
}

/**
 * @brief 复制数组数据
 * @param src 源数组
 * @param target 目标数组
 * @param length 数组长度
 */
void array_copy(int *src, int *target, int length) {
    for(int i = 0 ; i < length ; i++) target[i] = src[i];
}

/**
 * @brief 测试排序时间
 * @param array 待排序数组
 * @param length 长度
 * @param fun 排序函数
 */
void test_sort_time(int *array, int length, void(*fun)(int*, int, sort_order)) {
    int *temp = (int *)malloc(sizeof(int)*length);
    array_copy(array, temp, length);
    clock_t start = clock();
    fun(temp, length, ASC);
    clock_t end = clock();
    printf("排序时间：%.4f", (double)(end - start)/(double)CLOCKS_PER_SEC);
    free(temp);
}

/**
 * @brief 排序比较
 * @param array 数组
 * @param length 长度
 */
void sort_compare(int *array, int length) {
    
}