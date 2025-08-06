import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from 'hooks/useLanguage';
import { IconStar, IconTrendingUp, IconBrain } from '@tabler/icons-react';
import { API } from 'utils/api';

const PricingSection = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [modelData, setModelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取模型数据
  useEffect(() => {
    const fetchModelData = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/user/modelbilling');
        const { success, data } = response.data;

        if (success && Array.isArray(data)) {
          setModelData(data);
          setError(null);
        } else {
          setError('无法获取模型数据');
        }
      } catch (err) {
        console.error('获取模型数据失败:', err);
        setError('获取模型数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchModelData();
  }, []);

  // 根据模型名称获取提供商
  const getProviderByModel = (modelName) => {
    const name = modelName.toLowerCase();
    if (name.includes('gpt') || name.includes('dall-e') || name.includes('whisper') || name.includes('tts')) {
      return 'OpenAI';
    } else if (name.includes('claude')) {
      return 'Anthropic';
    } else if (name.includes('gemini')) {
      return 'Google';
    } else if (name.includes('deepseek')) {
      return 'DeepSeek';
    } else if (name.includes('qwen')) {
      return 'Alibaba';
    } else if (name.includes('glm') || name.includes('chatglm')) {
      return '智谱AI';
    } else if (name.includes('yi-')) {
      return '零一万物';
    } else if (name.includes('moonshot') || name.includes('kimi')) {
      return 'Moonshot';
    } else if (name.includes('spark')) {
      return '讯飞星火';
    } else if (name.includes('hunyuan')) {
      return '腾讯';
    } else if (name.includes('doubao')) {
      return '字节跳动';
    } else if (name.includes('midjourney') || name.includes('mj')) {
      return 'Midjourney';
    } else if (name.includes('flux')) {
      return 'Flux';
    } else if (name.includes('stable-diffusion')) {
      return 'Stability AI';
    }
    return '其他';
  };

  // 根据模型名称判断类型
  const getModelCategory = (modelName) => {
    const name = modelName.toLowerCase();
    if (name.includes('dall-e') || name.includes('midjourney') || name.includes('mj') ||
        name.includes('flux') || name.includes('stable-diffusion') || name.includes('wanx')) {
      return 2; // 创意模型
    } else if (name.includes('code') || name.includes('codestral') ||
               name.includes('deepseek-coder') || name.includes('yi-coder')) {
      return 1; // 代码模型
    }
    return 0; // 对话模型
  };

  // 格式化价格显示
  const formatPrice = (price) => {
    if (price === 0) return '免费';
    if (price < 0.001) return `$${(price * 1000).toFixed(3)}/M tokens`;
    return `$${price.toFixed(4)}/1K tokens`;
  };

  // 判断是否为热门模型
  const isPopularModel = (modelName) => {
    const popularModels = [
      'gpt-4o', 'gpt-4o-mini', 'claude-3.5-sonnet', 'claude-3-haiku',
      'gemini-1.5-pro', 'gemini-1.5-flash', 'deepseek-chat', 'qwen-max',
      'glm-4', 'yi-large', 'moonshot-v1-8k', 'dall-e-3', 'midjourney'
    ];
    return popularModels.some(popular => modelName.toLowerCase().includes(popular.toLowerCase()));
  };

  // 处理和分类模型数据
  const processModelData = () => {
    if (!modelData.length) return [[], [], []];

    const categories = [[], [], []]; // 对话、代码、创意

    modelData.forEach(model => {
      const categoryIndex = getModelCategory(model.model);
      const processedModel = {
        name: model.model,
        provider: getProviderByModel(model.model),
        inputPrice: formatPrice(model.model_ratio / 500000), // 转换为美元
        outputPrice: formatPrice(model.model_completion_ratio / 500000),
        popular: isPopularModel(model.model),
        description: getModelDescription(model.model),
        modelType: model.model_type || ''
      };

      categories[categoryIndex].push(processedModel);
    });

    // 对每个分类进行排序，热门模型在前
    categories.forEach(category => {
      category.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.name.localeCompare(b.name);
      });
    });

    return categories;
  };

  // 获取模型描述
  const getModelDescription = (modelName) => {
    const name = modelName.toLowerCase();
    if (name.includes('gpt-4o')) return '最新的GPT-4优化版本，性能卓越';
    if (name.includes('claude-3.5-sonnet')) return '强大的推理能力，适合复杂任务';
    if (name.includes('gemini-1.5-pro')) return '支持长上下文，多模态能力强';
    if (name.includes('deepseek')) return '高性价比的开源模型';
    if (name.includes('qwen')) return '阿里巴巴通义千问系列';
    if (name.includes('glm')) return '智谱AI自研模型';
    if (name.includes('dall-e')) return '高质量图像生成';
    if (name.includes('midjourney')) return '艺术风格图像生成';
    return '优质AI模型服务';
  };

  const processedCategories = processModelData();

  // 模型分类标签
  const modelCategories = [
    {
      name: '对话模型',
      nameEn: 'Chat Models',
      models: processedCategories[0] || []
    },
    {
      name: '代码模型',
      nameEn: 'Code Models',
      models: processedCategories[1] || []
    },
    {
      name: '创意模型',
      nameEn: 'Creative Models',
      models: processedCategories[2] || []
    }
  ];

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              mb: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #fff 30%, #e0e7ff 90%)'
                : 'linear-gradient(45deg, #1e293b 30%, #475569 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('pricing.title')}
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {t('pricing.subtitle')}
          </Typography>
        </motion.div>

        {/* 分类标签 */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: theme.palette.primary.main
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 1.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }
            }}
          >
            {modelCategories.map((category, index) => (
              <Tab
                key={index}
                label={category.name}
                icon={
                  index === 0 ? <IconBrain size={20} /> :
                  index === 1 ? <IconTrendingUp size={20} /> :
                  <IconStar size={20} />
                }
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {/* 价格表 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: theme.shadows[8]
              }}
            >
              {modelCategories[selectedCategory].models.length > 0 ? (
                <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          模型名称
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          提供商
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          {t('pricing.input')}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          {t('pricing.output')}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                          描述
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {modelCategories[selectedCategory].models.slice(0, 10).map((model, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05)
                            },
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {model.name}
                              </Typography>
                              {model.popular && (
                                <Chip
                                  label={t('pricing.popular')}
                                  size="small"
                                  sx={{
                                    background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {model.provider}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                              {model.inputPrice}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                              {model.outputPrice}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {model.description}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    该分类暂无可用模型
                  </Typography>
                </Box>
              )}
            </Card>
          </motion.div>
        )}

        {/* 价格说明 */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            * 价格可能根据市场情况调整，具体以实际计费为准
          </Typography>
          <Typography variant="body2" color="text.secondary">
            * 支持按需付费，无最低消费限制
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PricingSection;
