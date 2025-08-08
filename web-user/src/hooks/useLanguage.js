import { useState, createContext, useContext } from 'react';

// 语言配置
const languages = {
  zh: {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
};

// 翻译文本
const translations = {
  zh: {
    // 导航
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.pricing': '模型定价',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.dashboard': '控制台',
    'nav.chat': '对话',

    // 首页标题和描述
    'home.title': 'AI 聚合平台',
    'home.subtitle': '一站式 AI 服务集成平台',
    'home.description':
      '汇聚全球顶尖 AI 模型，为开发者和企业提供统一、高效、经济的 AI 接口服务',
    'home.cta.docs': '查看文档',
    'home.cta.start': '立即开始',
    'home.cta.pricing': '查看价格',

    // 特性
    'features.title': '为什么选择我们',
    'features.subtitle': '专业的 AI 聚合服务，让您专注于业务创新',
    'features.cost.title': '性价比高',
    'features.cost.desc': '提供市场上最具竞争力的价格，让AI技术触手可及',
    'features.speed.title': '响应迅速',
    'features.speed.desc': '全球分布式架构，毫秒级响应，保障服务稳定性',
    'features.models.title': '模型丰富',
    'features.models.desc': '支持 GPT、Claude、Gemini 等主流模型，满足不同需求',
    'features.support.title': '专业支持',
    'features.support.desc': '7x24小时技术支持，完善的文档和示例代码',

    // 统计数据
    'stats.models': '支持模型',
    'stats.users': '活跃用户',
    'stats.requests': '日请求量',
    'stats.uptime': '服务可用性',

    // 应用场景
    'applications.title': '应用场景',
    'applications.subtitle': '支持多种AI应用场景，满足不同行业需求',
    'applications.chat.title': '智能对话',
    'applications.chat.desc': '支持 SillyTavern、Omate、Tavo 等虚拟聊天应用',
    'applications.code.title': '代码辅助',
    'applications.code.desc':
      '支持 Claude Code、Gemini CLI、Cursor、Cline 等代码编辑工具',
    'applications.translate.title': '翻译服务',
    'applications.translate.desc': '提供高质量的多语言翻译服务',
    'applications.creative.title': '创意生成',
    'applications.creative.desc': '支持文本生成、图像创作等创意应用',

    // 价格表
    'pricing.title': '模型价格',
    'pricing.subtitle': '透明的价格，无隐藏费用',
    'pricing.input': '输入价格',
    'pricing.output': '输出价格',
    'pricing.per1k': '每1K tokens',
    'pricing.popular': '热门',

    // 页脚
    'footer.description':
      '专业的 AI 聚合服务平台，为全球开发者提供优质的 AI 接口服务',
    'footer.links': '快速链接',
    'footer.support': '支持',
    'footer.contact': '联系我们',
    'footer.rights': '版权所有',

    // SEO
    'seo.title': 'AI 聚合平台 - 一站式 AI 服务集成',
    'seo.description':
      '专业的 AI 聚合服务平台，支持 GPT、Claude、Gemini 等主流模型，为 SillyTavern、Cursor、Cline 等应用提供高性价比的 AI 接口服务',
    'seo.keywords':
      'AI API, GPT API, Claude API, Gemini API, AI聚合, 人工智能接口, SillyTavern, Cursor, Cline',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.pricing': 'Model Pricing',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.chat': 'Chat',

    // Homepage title and description
    'home.title': 'AI Aggregation Platform',
    'home.subtitle': 'One-Stop AI Service Integration Platform',
    'home.description':
      'Aggregating world-class AI models to provide unified, efficient, and economical AI interface services for developers and enterprises',
    'home.cta.docs': 'View Docs',
    'home.cta.start': 'Get Started',
    'home.cta.pricing': 'View Pricing',

    // Features
    'features.title': 'Why Choose Us',
    'features.subtitle':
      'Professional AI aggregation services, let you focus on business innovation',
    'features.cost.title': 'Cost-Effective',
    'features.cost.desc':
      'Providing the most competitive prices in the market, making AI technology accessible',
    'features.speed.title': 'Fast Response',
    'features.speed.desc':
      'Global distributed architecture with millisecond response, ensuring service stability',
    'features.models.title': 'Rich Models',
    'features.models.desc':
      'Supporting mainstream models like GPT, Claude, Gemini to meet different needs',
    'features.support.title': 'Professional Support',
    'features.support.desc':
      '7x24 technical support with comprehensive documentation and sample code',

    // Statistics
    'stats.models': 'Supported Models',
    'stats.users': 'Active Users',
    'stats.requests': 'Daily Requests',
    'stats.uptime': 'Service Uptime',

    // Applications
    'applications.title': 'Use Cases',
    'applications.subtitle':
      'Supporting various AI application scenarios for different industry needs',
    'applications.chat.title': 'Smart Chat',
    'applications.chat.desc':
      'Supporting virtual chat apps like SillyTavern, Omate, Tavo',
    'applications.code.title': 'Code Assistant',
    'applications.code.desc':
      'Supporting code editing tools like Claude Code, Gemini CLI, Cursor, Cline',
    'applications.translate.title': 'Translation Service',
    'applications.translate.desc':
      'Providing high-quality multilingual translation services',
    'applications.creative.title': 'Creative Generation',
    'applications.creative.desc':
      'Supporting text generation, image creation and other creative applications',

    // Pricing
    'pricing.title': 'Model Pricing',
    'pricing.subtitle': 'Transparent pricing with no hidden fees',
    'pricing.input': 'Input Price',
    'pricing.output': 'Output Price',
    'pricing.per1k': 'per 1K tokens',
    'pricing.popular': 'Popular',

    // Footer
    'footer.description':
      'Professional AI aggregation service platform providing quality AI interface services for global developers',
    'footer.links': 'Quick Links',
    'footer.support': 'Support',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All Rights Reserved',

    // SEO
    'seo.title': 'AI Aggregation Platform - One-Stop AI Service Integration',
    'seo.description':
      'Professional AI aggregation service platform supporting mainstream models like GPT, Claude, Gemini, providing cost-effective AI interface services for SillyTavern, Cursor, Cline and other applications',
    'seo.keywords':
      'AI API, GPT API, Claude API, Gemini API, AI aggregation, artificial intelligence interface, SillyTavern, Cursor, Cline',
  },
};

// 语言上下文
const LanguageContext = createContext();

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // 从localStorage获取保存的语言，或根据浏览器语言自动检测
    const saved = localStorage.getItem('language');
    if (saved && languages[saved]) {
      return saved;
    }

    // 自动检测浏览器语言
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
      return 'zh';
    }
    return 'en';
  });

  const changeLanguage = (langCode) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('language', langCode);

      // 更新HTML lang属性
      document.documentElement.lang = langCode;
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages,
    isRTL: false, // 可以根据语言设置RTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言的Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default useLanguage;
