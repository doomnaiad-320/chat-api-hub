import React, { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Typography,
  Box,
  Alert,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Container,
  useMediaQuery,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import { IconSearch, IconCopy, IconFilter } from '@tabler/icons-react';
import { API } from 'utils/api';
import { useTheme } from '@mui/material/styles';
import {
  OpenAI, // OpenAI
  Claude, // Anthropic Claude
  Gemini, // Google Gemini
  DeepSeek, // deepseek
  Zhipu, // 智谱 AI
  Hunyuan, // 腾讯混元
  Spark, // 讯飞星火
  Minimax, // MiniMax
  Yi, // 零一万物
  Groq, // Groq
  Ollama, // Ollama
  Doubao, // 豆包
  Ai360, // 360 AI
  Midjourney, // Midjourney
  Flux,
  Grok,
  Suno,
  Pika,
  Vidu,
  BaiduCloud,
  AlibabaCloud,
  Cohere,
  Baichuan,
  Kimi,
} from '@lobehub/icons';

function formatNumber(num) {
  if (num % 1 !== 0) {
    const decimalPart = num.toString().split('.')[1];
    if (decimalPart.length > 5) {
      return num.toFixed(5);
    } else {
      return num;
    }
  } else {
    return num;
  }
}

// 格式化价格显示，去掉末尾的0
function formatPrice(price) {
  if (price === undefined || price === null || price === 0) return '0';
  return parseFloat(price.toFixed(6)).toString();
}

export default function ModelPricing() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activePricingFilter, setActivePricingFilter] = useState('All');

  // 筛选器配置
  const filterOptions = [
    { key: 'All', label: '全部', icon: <IconFilter size={16} /> },
    { key: 'Gemini', label: 'Gemini', icon: getFilterIcon('Gemini') },
    { key: 'OpenAI', label: 'OpenAI', icon: getFilterIcon('OpenAI') },
    {
      key: 'Anthropic_claude',
      label: 'Claude',
      icon: getFilterIcon('Anthropic_claude'),
    },
    { key: 'xAI', label: 'xAI', icon: getFilterIcon('xAI') },
    { key: 'DeepSeek', label: 'DeepSeek', icon: getFilterIcon('DeepSeek') },
    { key: 'Other', label: '其他', icon: <IconFilter size={16} /> },
  ];

  // 计费类型筛选选项
  const pricingFilterOptions = [
    { key: 'All', label: '全部计费', icon: <IconFilter size={16} /> },
    { key: 'PerCall', label: '按次计费', icon: <IconFilter size={16} /> },
    { key: 'Free', label: '免费', icon: <IconFilter size={16} /> },
    { key: 'Token', label: 'Token计费', icon: <IconFilter size={16} /> },
  ];

  // 复制模型名称到剪贴板
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // 这里可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 获取筛选器图标
  function getFilterIcon(filterKey) {
    switch (filterKey) {
      case 'Gemini':
        return <Gemini.Color size={16} />;
      case 'OpenAI':
        return <OpenAI.Avatar size={16} />;
      case 'Anthropic_claude':
        return <Claude.Color size={16} />;
      case 'xAI':
        return <Grok size={16} />;
      case 'DeepSeek':
        return <DeepSeek.Color size={16} />;
      default:
        return <IconFilter size={16} />;
    }
  }

  const loadModels = async (search) => {
    try {
      let url = '/api/user/modelbilling';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (params.toString()) url += `?${params.toString()}`;

      let res = await API.get(url);

      // 检查响应结构
      if (!res || !res.data) {
        console.error('API响应结构错误:', res);
        setModels([]);
        return;
      }

      const { success, data } = res.data;
      if (success && Array.isArray(data)) {
        console.log('📊 模型数据加载成功:', {
          总数: data.length,
          前3个模型: data.slice(0, 3).map((m) => ({
            model: m.model,
            model_ratio_2: m.model_ratio_2,
            model_ratio: m.model_ratio,
            model_completion_ratio: m.model_completion_ratio,
          })),
        });
        setModels(data);
      } else {
        console.error('API返回数据格式错误:', res.data);
        setModels([]);
      }
    } catch (err) {
      console.error('加载模型数据失败:', err);
      setModels([]);
    }
  };

  useEffect(() => {
    loadModels('');
  }, []);

  useEffect(() => {
    loadModels(currentSearchTerm);
  }, [currentSearchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setCurrentSearchTerm(searchTerm);
  };

  // 根据筛选器过滤模型
  const filterModelsByCategory = (models, filter) => {
    if (filter === 'All') return models;

    return models.filter((model) => {
      const modelName = model.model.toLowerCase();
      switch (filter) {
        case 'Gemini':
          return modelName.includes('gemini');
        case 'OpenAI':
          return (
            modelName.startsWith('gpt-') ||
            modelName.startsWith('o1-') ||
            modelName.startsWith('o3-') ||
            modelName.startsWith('o4-') ||
            modelName.startsWith('tts-') ||
            modelName.startsWith('dall-e') ||
            modelName.startsWith('whisper') ||
            modelName.startsWith('chatgpt')
          );
        case 'Anthropic_claude':
          return modelName.includes('claude');
        case 'xAI':
          return modelName.includes('grok');
        case 'DeepSeek':
          return modelName.includes('deepseek');
        case 'Other':
          return (
            !modelName.includes('gemini') &&
            !modelName.includes('claude') &&
            !modelName.includes('grok') &&
            !modelName.includes('deepseek') &&
            !(
              modelName.startsWith('gpt-') ||
              modelName.startsWith('o1-') ||
              modelName.startsWith('o3-') ||
              modelName.startsWith('o4-') ||
              modelName.startsWith('tts-') ||
              modelName.startsWith('dall-e') ||
              modelName.startsWith('whisper') ||
              modelName.startsWith('chatgpt')
            )
          );
        default:
          return true;
      }
    });
  };

  // 根据模型配置判断计费方式 - 使用 has_model_price 字段
  const getModelBillingType = (model) => {
    console.log('🔍 判断模型计费类型:', {
      model: model.model,
      model_ratio_2: model.model_ratio_2,
      has_model_price: model.has_model_price,
      model_ratio: model.model_ratio,
      model_completion_ratio: model.model_completion_ratio,
    });

    // 1. 检查是否在ModelPrice中配置了按次计费
    if (model.has_model_price) {
      if (model.model_ratio_2 > 0) {
        console.log('✅ 按次计费:', model.model, '价格:', model.model_ratio_2);
        return 'PerCall'; // 按次计费
      } else {
        console.log('✅ 按次免费:', model.model, '(ModelPrice中配置为0)');
        return 'Free'; // 在ModelPrice中配置但价格为0，显示免费
      }
    }

    // 2. 没有在ModelPrice中配置，检查Token计费配置
    const hasTokenRatio =
      (model.model_ratio !== undefined && model.model_ratio !== null) ||
      (model.model_completion_ratio !== undefined &&
        model.model_completion_ratio !== null);

    if (hasTokenRatio) {
      console.log(
        '✅ Token计费:',
        model.model,
        'ratio:',
        model.model_ratio,
        'completion:',
        model.model_completion_ratio
      );
      return 'Token'; // Token计费
    }

    console.log('✅ 完全免费:', model.model, '(无任何计费配置)');
    return 'Free'; // 完全免费
  };

  // 根据计费类型筛选模型
  const filterModelsByPricing = (models, filter) => {
    if (filter === 'All') return models;

    return models.filter((model) => {
      const billingType = getModelBillingType(model);
      return billingType === filter;
    });
  };

  // 应用筛选器和搜索
  const filteredModels = filterModelsByPricing(
    filterModelsByCategory(models, activeFilter),
    activePricingFilter
  ).filter((model) =>
    model.model.toLowerCase().includes(currentSearchTerm.toLowerCase())
  );

  const hasModels = filteredModels.length > 0;

  // 根据模型名称获取图标
  const getModelIcon = (modelInfo) => {
    const { model } = modelInfo;

    if (model.startsWith('gpt-3')) {
      return <OpenAI.Avatar size={20} type='gpt3' />;
    } else if (model.startsWith('gpt-4') || model.startsWith('chatgpt')) {
      return <OpenAI.Avatar size={20} type='gpt4' />;
    } else if (
      model.startsWith('o1') ||
      model.startsWith('o3') ||
      model.startsWith('o4')
    ) {
      return <OpenAI.Avatar size={20} type='o1' />;
    } else if (
      model.startsWith('tts') ||
      model.startsWith('dall-e') ||
      model.startsWith('whisper') ||
      model.startsWith('omni-') ||
      model.startsWith('text-embedding') ||
      model.startsWith('text-moderation-') ||
      model.startsWith('davinci') ||
      model.startsWith('babbage')
    ) {
      return <OpenAI.Avatar size={20} />;
    } else if (model.startsWith('claude')) {
      return <Claude.Color size={20} />;
    } else if (model.startsWith('gemini')) {
      return <Gemini.Color size={20} />;
    } else if (model.startsWith('deepseek')) {
      return <DeepSeek.Color size={20} />;
    } else if (model.startsWith('glm') || model.startsWith('chatglm')) {
      return <Zhipu.Color size={20} />;
    } else if (model.startsWith('hunyuan')) {
      return <Hunyuan.Color size={20} />;
    } else if (model.startsWith('spark') || model.startsWith('Spark')) {
      return <Spark.Color size={20} />;
    } else if (model.startsWith('abab')) {
      return <Minimax.Color size={20} />;
    } else if (model.startsWith('moonshot')) {
      return <Kimi.Color size={20} />;
    } else if (model.startsWith('yi')) {
      return <Yi.Color size={20} />;
    } else if (model.startsWith('groq')) {
      return <Groq size={20} />;
    } else if (model.startsWith('ollama') || model.startsWith('llama')) {
      return <Ollama size={20} />;
    } else if (model.startsWith('doubao')) {
      return <Doubao.Color size={20} />;
    } else if (model.startsWith('360')) {
      return <Ai360.Color size={20} />;
    } else if (model.startsWith('midjourney') || model.startsWith('mj-chat')) {
      return <Midjourney size={20} />;
    } else if (model.startsWith('flux')) {
      return <Flux size={20} />;
    } else if (model.startsWith('grok')) {
      return <Grok size={20} />;
    } else if (model.startsWith('suno')) {
      return <Suno size={20} />;
    } else if (model.startsWith('pika')) {
      return <Pika size={20} />;
    } else if (model.startsWith('vidu')) {
      return <Vidu.Color size={20} />;
    } else if (model.startsWith('ERNIE-')) {
      return <BaiduCloud.Color size={20} />;
    } else if (model.startsWith('qwen-')) {
      return <AlibabaCloud.Color size={20} />;
    } else if (model.startsWith('command')) {
      return <Cohere.Color size={20} />;
    } else if (model.startsWith('Baichuan')) {
      return <Baichuan.Color size={20} />;
    }

    // 如果没有匹配到，返回默认图标
    return <OpenAI size={20} />;
  };

  // 现代化简洁模型卡片组件
  const ModelCard = ({ model }) => {
    // 使用统一的计费类型判断逻辑
    const billingType = getModelBillingType(model);
    const hasPerCallPrice = billingType === 'PerCall';
    const hasTokenPrice = billingType === 'Token';

    // 计费标签配置 - 果汁色系
    const getBillingConfig = () => {
      if (hasPerCallPrice) {
        return {
          label: '按次计费',
          color: '#7c3aed', // 紫色果汁
          bgColor: '#f3f4f6',
          labelBgColor: '#ede9fe',
          price: `¥${formatPrice(model.model_ratio_2)}/次`,
        };
      }
      if (hasTokenPrice) {
        return {
          label: 'Token计费',
          color: '#f59e0b', // 橙色果汁
          bgColor: '#f3f4f6',
          labelBgColor: '#fef3c7',
          price: model.model_ratio
            ? `输入 ¥${formatNumber(model.model_ratio * 2)}/1M`
            : '',
        };
      }
      return {
        label: '免费',
        color: '#10b981', // 绿色果汁
        bgColor: '#f3f4f6',
        labelBgColor: '#d1fae5',
        price: '无需付费',
      };
    };

    const billingConfig = getBillingConfig();

    return (
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            borderColor: billingConfig.color,
            boxShadow: `0 8px 25px ${billingConfig.color}15`,
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 模型名称 - 占据上部空间 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 'auto',
              pb: 2,
            }}
          >
            {getModelIcon(model)}
            <Typography
              variant='h6'
              sx={{
                ml: 1.5,
                fontWeight: 500,
                fontSize: '12px',
                color: 'text.primary',
                flex: 1,
                lineHeight: 1.4,
                wordBreak: 'break-word',
              }}
            >
              {model.model}
            </Typography>
            <Tooltip title='复制模型名称' arrow>
              <IconButton
                size='small'
                onClick={() => copyToClipboard(model.model)}
                sx={{
                  color: 'text.secondary',
                  flexShrink: 0,
                  ml: 1,
                  '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <IconCopy size={12} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* 计费信息 - 固定在底部 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderRadius: 1,
              backgroundColor: billingConfig.bgColor,
              mt: 'auto',
            }}
          >
            {/* 计费标签 */}
            <Typography
              variant='caption'
              sx={{
                color: billingConfig.color,
                fontWeight: 500,
                fontSize: '11px',
                px: 1,
                py: 0.25,
                borderRadius: 0.5,
                backgroundColor: billingConfig.labelBgColor,
              }}
            >
              {billingConfig.label}
            </Typography>

            {/* 价格信息 - Token计费特殊处理 */}
            {hasTokenPrice ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 0.25,
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '11px',
                  }}
                >
                  输入 ¥{formatNumber(model.model_ratio * 2)}/1M
                </Typography>
                {model.model_completion_ratio && (
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '11px',
                    }}
                  >
                    输出 ¥{formatNumber(model.model_completion_ratio * 2)}/1M
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography
                variant='body2'
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '11px',
                }}
              >
                {billingConfig.price}
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* 页面标题和描述 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant='h3'
          component='h1'
          sx={{
            fontWeight: 700,
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: isMobile ? '2rem' : '3rem',
          }}
        >
          AI模型计费
        </Typography>
        <Typography
          variant='h6'
          color='text.secondary'
          sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
        >
          专业的AI模型API服务，透明的计费标准，支持按次计费和Token计费
        </Typography>

        <Alert
          severity='info'
          sx={{
            maxWidth: 800,
            mx: 'auto',
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
            },
          }}
        >
          按次计费与按Token计费同时存在时，按次计费优先生效
        </Alert>
      </Box>

      {/* 搜索和筛选区域 */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Stack spacing={3}>
          {/* 搜索框 */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: isMobile ? '100%' : '400px', maxWidth: '100%' }}>
              <OutlinedInput
                fullWidth
                placeholder='搜索模型名称...'
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                startAdornment={
                  <InputAdornment position='start'>
                    <IconSearch
                      size={20}
                      color={theme.palette.text.secondary}
                    />
                  </InputAdornment>
                }
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.divider,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          </Box>

          {/* 筛选器区域 */}
          <Stack spacing={2}>
            {/* 模型类型筛选器 - 统一样式 */}
            <Box>
              <Typography
                variant='subtitle2'
                sx={{
                  mb: 1.5,
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                模型类型
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filterOptions.map((filter) => {
                  const isActive = activeFilter === filter.key;

                  return (
                    <Box
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                        border: `1px solid ${isActive ? '#cbd5e1' : '#e2e8f0'}`,
                        '&:hover': {
                          backgroundColor: '#f8fafc',
                          borderColor: '#cbd5e1',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <Box
                          sx={{
                            color: isActive ? 'text.primary' : 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {filter.icon}
                        </Box>
                        <Typography
                          variant='body2'
                          sx={{
                            color: isActive ? 'text.primary' : 'text.secondary',
                            fontWeight: isActive ? 500 : 400,
                            fontSize: '13px',
                          }}
                        >
                          {filter.label}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* 计费类型筛选器 - 简洁样式 */}
            <Box>
              <Typography
                variant='subtitle2'
                sx={{
                  mb: 1.5,
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                计费类型
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {pricingFilterOptions.map((filter) => {
                  const isActive = activePricingFilter === filter.key;

                  // 根据筛选器类型设置果汁色
                  const getFilterColor = () => {
                    if (filter.key === 'PerCall')
                      return { color: '#7c3aed', bgColor: '#ede9fe' };
                    if (filter.key === 'Token')
                      return { color: '#f59e0b', bgColor: '#fef3c7' };
                    if (filter.key === 'Free')
                      return { color: '#10b981', bgColor: '#d1fae5' };
                    return { color: '#6b7280', bgColor: '#f3f4f6' };
                  };
                  const filterColors = getFilterColor();

                  return (
                    <Box
                      key={filter.key}
                      onClick={() => setActivePricingFilter(filter.key)}
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: isActive
                          ? filterColors.bgColor
                          : 'transparent',
                        border: `1px solid ${
                          isActive ? filterColors.color : '#e2e8f0'
                        }`,
                        '&:hover': {
                          backgroundColor: filterColors.bgColor,
                          borderColor: filterColors.color,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                        }}
                      >
                        <Box
                          sx={{
                            color: isActive
                              ? filterColors.color
                              : 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {filter.icon}
                        </Box>
                        <Typography
                          variant='body2'
                          sx={{
                            color: isActive
                              ? filterColors.color
                              : 'text.secondary',
                            fontWeight: isActive ? 500 : 400,
                            fontSize: '13px',
                          }}
                        >
                          {filter.label}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* 模型卡片网格 */}
      {hasModels ? (
        <>
          {/* 结果统计 */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='body1' color='text.secondary'>
              找到 <strong>{filteredModels.length}</strong> 个模型
              {activeFilter !== 'All' && (
                <Chip
                  label={
                    filterOptions.find((f) => f.key === activeFilter)?.label
                  }
                  size='small'
                  color='primary'
                  sx={{ ml: 1 }}
                />
              )}
              {activePricingFilter !== 'All' && (
                <Chip
                  label={
                    pricingFilterOptions.find(
                      (f) => f.key === activePricingFilter
                    )?.label
                  }
                  size='small'
                  color='secondary'
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
          </Box>

          {/* 模型卡片网格 */}
          <Grid container spacing={3}>
            {filteredModels.map((model, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <ModelCard model={model} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
          }}
        >
          <Typography variant='h5' color='text.secondary' sx={{ mb: 2 }}>
            {currentSearchTerm || activeFilter !== 'All'
              ? '没有找到匹配的模型'
              : '暂无可用模型'}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {currentSearchTerm || activeFilter !== 'All'
              ? '请尝试调整搜索条件或筛选器'
              : '请稍后再试或联系管理员'}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
