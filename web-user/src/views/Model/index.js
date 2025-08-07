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
  Divider,
  InputAdornment,
  OutlinedInput
} from '@mui/material';
import {
  IconSearch,
  IconCopy,
  IconFilter
} from '@tabler/icons-react';
import { API } from 'utils/api';
import { useTheme } from '@mui/material/styles';
import { 
  OpenAI,          // OpenAI
  Claude,          // Anthropic Claude
  Gemini,          // Google Gemini
  DeepSeek,        // deepseek
  Zhipu,           // 智谱 AI
  Hunyuan,         // 腾讯混元
  Spark,           // 讯飞星火
  Minimax,         // MiniMax
  Yi,              // 零一万物
  Groq,            // Groq
  Ollama,          // Ollama
  Doubao,          // 豆包
  Ai360,          // 360 AI
  Midjourney ,     // Midjourney
  Flux,
  Grok,
  Suno,
  Pika,
  Vidu,
  BaiduCloud,
  AlibabaCloud,
  Cohere,
  Baichuan,
  Kimi 
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
    { key: 'Anthropic_claude', label: 'Claude', icon: getFilterIcon('Anthropic_claude') },
    { key: 'xAI', label: 'xAI', icon: getFilterIcon('xAI') },
    { key: 'DeepSeek', label: 'DeepSeek', icon: getFilterIcon('DeepSeek') },
    { key: 'Other', label: '其他', icon: <IconFilter size={16} /> }
  ];

  // 计费类型筛选选项
  const pricingFilterOptions = [
    { key: 'All', label: '全部计费', icon: <IconFilter size={16} /> },
    { key: 'PerCall', label: '按次计费', icon: <IconFilter size={16} /> },
    { key: 'Free', label: '免费', icon: <IconFilter size={16} /> },
    { key: 'Token', label: 'Token计费', icon: <IconFilter size={16} /> }
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
          前3个模型: data.slice(0, 3).map(m => ({
            model: m.model,
            model_ratio_2: m.model_ratio_2,
            model_ratio: m.model_ratio,
            model_completion_ratio: m.model_completion_ratio
          }))
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

    return models.filter(model => {
      const modelName = model.model.toLowerCase();
      switch (filter) {
        case 'Gemini':
          return modelName.includes('gemini');
        case 'OpenAI':
          return modelName.startsWith('gpt-') || modelName.startsWith('o1-') ||
                 modelName.startsWith('o3-') || modelName.startsWith('o4-') ||
                 modelName.startsWith('tts-') || modelName.startsWith('dall-e') ||
                 modelName.startsWith('whisper') || modelName.startsWith('chatgpt');
        case 'Anthropic_claude':
          return modelName.includes('claude');
        case 'xAI':
          return modelName.includes('grok');
        case 'DeepSeek':
          return modelName.includes('deepseek');
        case 'Other':
          return !modelName.includes('gemini') &&
                 !modelName.includes('claude') &&
                 !modelName.includes('grok') &&
                 !modelName.includes('deepseek') &&
                 !(modelName.startsWith('gpt-') || modelName.startsWith('o1-') ||
                   modelName.startsWith('o3-') || modelName.startsWith('o4-') ||
                   modelName.startsWith('tts-') || modelName.startsWith('dall-e') ||
                   modelName.startsWith('whisper') || modelName.startsWith('chatgpt'));
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
      model_completion_ratio: model.model_completion_ratio
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
    const hasTokenRatio = (model.model_ratio !== undefined && model.model_ratio !== null) ||
                         (model.model_completion_ratio !== undefined && model.model_completion_ratio !== null);

    if (hasTokenRatio) {
      console.log('✅ Token计费:', model.model, 'ratio:', model.model_ratio, 'completion:', model.model_completion_ratio);
      return 'Token'; // Token计费
    }

    console.log('✅ 完全免费:', model.model, '(无任何计费配置)');
    return 'Free'; // 完全免费
  };

  // 根据计费类型筛选模型
  const filterModelsByPricing = (models, filter) => {
    if (filter === 'All') return models;

    return models.filter(model => {
      const billingType = getModelBillingType(model);
      return billingType === filter;
    });
  };

  // 应用筛选器和搜索
  const filteredModels = filterModelsByPricing(
    filterModelsByCategory(models, activeFilter),
    activePricingFilter
  ).filter(model =>
    model.model.toLowerCase().includes(currentSearchTerm.toLowerCase())
  );

  const hasModels = filteredModels.length > 0;

  // 根据模型名称获取图标
  const getModelIcon = (modelInfo) => {
    const { model } = modelInfo;
    
    if (model.startsWith('gpt-3')) {
      return <OpenAI.Avatar size={20} type="gpt3" />;
    } else if (model.startsWith('gpt-4') || model.startsWith('chatgpt')) {
      return <OpenAI.Avatar size={20} type="gpt4" />;
    } else if (model.startsWith('o1') || model.startsWith('o3') || model.startsWith('o4')) {
      return <OpenAI.Avatar size={20} type="o1" />;
    } else if (model.startsWith('tts') || model.startsWith('dall-e') || 
    model.startsWith('whisper') || model.startsWith('omni-') || 
    model.startsWith('text-embedding') || model.startsWith('text-moderation-')
     || model.startsWith('davinci') ||  model.startsWith('babbage')
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



  // 模型卡片组件
  const ModelCard = ({ model }) => {
    // 使用统一的计费类型判断逻辑
    const billingType = getModelBillingType(model);
    const isFreeModel = billingType === 'Free';
    const hasPerCallPrice = billingType === 'PerCall';
    const hasTokenPrice = billingType === 'Token';

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
            borderColor: theme.palette.primary.main,
          }
        }}
      >
        <Box sx={{ p: 2, flex: 1 }}>
          {/* 模型名称和图标 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            {getModelIcon(model)}
            <Typography
              variant="subtitle1"
              sx={{
                ml: 1,
                fontWeight: 500,
                fontSize: isMobile ? '0.75rem' : '0.85rem',
                color: theme.palette.text.primary,
                flex: 1,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {model.model}
            </Typography>
            <Tooltip title="复制模型名称">
              <IconButton
                size="small"
                onClick={() => copyToClipboard(model.model)}
                sx={{
                  ml: 1,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <IconCopy size={12} />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          {/* 价格信息 */}
          <Box>
            {isFreeModel ? (
              // 免费模型 - 绿色
              <Box>
                <Chip
                  label="免费"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.success.main,
                    color: 'white',
                    fontWeight: 600,
                    mb: 1
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.85rem',
                    color: theme.palette.text.primary
                  }}
                >
                  无需付费
                </Typography>
              </Box>
            ) : hasPerCallPrice ? (
              // 按次计费 - 蓝色
              <Box>
                <Chip
                  label="按次计费"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 600,
                    mb: 1
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.85rem',
                    color: theme.palette.text.primary,
                    fontWeight: 500
                  }}
                >
                  {formatPrice(model.model_ratio_2)}/次
                </Typography>
              </Box>
            ) : hasTokenPrice ? (
              // Token计费 - 橙色
              <Box>
                <Chip
                  label="Token计费"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.warning.main,
                    color: 'white',
                    fontWeight: 600,
                    mb: 1
                  }}
                />
                <Stack direction="column" spacing={0.3}>
                  {(model.model_ratio !== undefined && model.model_ratio !== null) && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.75rem',
                        color: theme.palette.text.primary,
                        fontWeight: 500
                      }}
                    >
                      输入: {formatNumber(model.model_ratio * 2)}/1M
                    </Typography>
                  )}
                  {(model.model_completion_ratio !== undefined && model.model_completion_ratio !== null) && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.75rem',
                        color: theme.palette.text.primary,
                        fontWeight: 500
                      }}
                    >
                      输出: {formatNumber(model.model_completion_ratio * 2)}/1M
                    </Typography>
                  )}
                </Stack>
              </Box>
            ) : null}
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 页面标题和描述 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: isMobile ? '2rem' : '3rem'
          }}
        >
          AI模型计费
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
        >
          专业的AI模型API服务，透明的计费标准，支持按次计费和Token计费
        </Typography>

        <Alert
          severity="info"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
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
                placeholder="搜索模型名称..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch size={20} color={theme.palette.text.secondary} />
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
            {/* 模型类型筛选器 */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                模型类型
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {filterOptions.map((filter) => (
                  <Chip
                    key={filter.key}
                    icon={filter.icon}
                    label={filter.label}
                    clickable
                    color={activeFilter === filter.key ? 'primary' : 'default'}
                    variant={activeFilter === filter.key ? 'filled' : 'outlined'}
                    onClick={() => setActiveFilter(filter.key)}
                    sx={{
                      fontWeight: activeFilter === filter.key ? 600 : 400,
                      px: 2,
                      py: 1,
                      height: 'auto',
                      '& .MuiChip-label': {
                        px: 1,
                        py: 0.5,
                        fontSize: '0.875rem'
                      },
                      '&:hover': {
                        backgroundColor: activeFilter === filter.key
                          ? theme.palette.primary.dark
                          : theme.palette.action.hover,
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* 计费类型筛选器 */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                计费类型
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {pricingFilterOptions.map((filter) => (
                  <Chip
                    key={filter.key}
                    icon={filter.icon}
                    label={filter.label}
                    clickable
                    color={activePricingFilter === filter.key ? 'secondary' : 'default'}
                    variant={activePricingFilter === filter.key ? 'filled' : 'outlined'}
                    onClick={() => setActivePricingFilter(filter.key)}
                    sx={{
                      fontWeight: activePricingFilter === filter.key ? 600 : 400,
                      px: 2,
                      py: 1,
                      height: 'auto',
                      '& .MuiChip-label': {
                        px: 1,
                        py: 0.5,
                        fontSize: '0.875rem'
                      },
                      '&:hover': {
                        backgroundColor: activePricingFilter === filter.key
                          ? theme.palette.secondary.dark
                          : theme.palette.action.hover,
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* 模型卡片网格 */}
      {hasModels ? (
        <>
          {/* 结果统计 */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              找到 <strong>{filteredModels.length}</strong> 个模型
              {activeFilter !== 'All' && (
                <Chip
                  label={filterOptions.find(f => f.key === activeFilter)?.label}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              )}
              {activePricingFilter !== 'All' && (
                <Chip
                  label={pricingFilterOptions.find(f => f.key === activePricingFilter)?.label}
                  size="small"
                  color="secondary"
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
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            {currentSearchTerm || activeFilter !== 'All'
              ? '没有找到匹配的模型'
              : '暂无可用模型'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentSearchTerm || activeFilter !== 'All'
              ? '请尝试调整搜索条件或筛选器'
              : '请稍后再试或联系管理员'}
          </Typography>
        </Box>
      )}
    </Container>
  );
}