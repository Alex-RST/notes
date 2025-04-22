<template>
    <div class="blog-index">
        <!-- 博客列表 -->
        <div class="blog-list">
            <div v-for="blog in blogs" :key="blog.id" class="blog-item">
                <h2 class="blog-title">{{ blog.url }}</h2>
                <p class="blog-excerpt">{{ blog.excerpt }}</p>
                <div class="blog-meta">
                    <span class="publish-date">{{ formatDate(blog.publishDate) }}</span>
                    <span class="read-time">{{ blog.readTime }} min read</span>
                </div>
            </div>
        </div>

        <!-- 分页控件 -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
                上一页
            </button>

            <span class="page-info">
                第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
            </span>

            <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
                下一页
            </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading">加载中...</div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {data as posts} from '../../../src/js/posts.data.js';

// 模拟数据
const mockBlogs = [
    {
        id: 1,
        title: 'Vue 3 入门指南',
        excerpt: '学习Vue 3的基本概念和核心功能...',
        publishDate: '2023-07-15',
        readTime: 5
    },
    // 添加更多模拟数据...
];

// 响应式数据
const blogs = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const error = ref(null);
const pageSize = 10; // 每页显示数量

// 获取博客数据的方法
const fetchBlogs = async () => {
    try {
        loading.value = true;
        error.value = null;

        // 模拟API调用，实际应用中替换为真实的API请求
        // const response = await fetch(`/api/blogs?page=${currentPage.value}&pageSize=${pageSize}`);
        // const data = await response.json();

        // 模拟数据
        // await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
        // const data = {
        //      blogs: mockBlogs,
        //     totalPages: 5
        // };

        blogs.value = function() {
            let startIndex = (currentPage.value - 1) * pageSize
            let endIndex = Math.min(startIndex + pageSize, posts.length)
            return posts.slice(startIndex, endIndex)
        }();
        totalPages.value = Math.ceil(posts.length / pageSize);
    } catch (err) {
        error.value = '加载博客失败，请稍后重试';
        console.error('Error fetching blogs:', err);
    } finally {
        loading.value = false;
    }
};

// 分页操作
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// 监听页码变化
watch(currentPage, () => {
    fetchBlogs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 日期格式化方法
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
};

// 初始化加载
onMounted(fetchBlogs);
</script>

<style scoped>
.blog-index {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.blog-item {
    margin-bottom: 40px;
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.blog-title {
    color: #333;
    margin-bottom: 10px;
}

.blog-excerpt {
    color: #666;
    line-height: 1.6;
}

.blog-meta {
    margin-top: 15px;
    font-size: 0.9em;
    color: #999;
}

.publish-date {
    margin-right: 15px;
}

.pagination {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.pagination-button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: #f8f9fa;
    cursor: pointer;
    border-radius: 4px;
}

.pagination-button:disabled {
    background: #eee;
    color: #999;
    cursor: not-allowed;
}

.page-info {
    color: #666;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}

.error-message {
    color: #dc3545;
    padding: 20px;
    text-align: center;
}
</style>