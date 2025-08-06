import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
// import { useLanguage } from 'hooks/useLanguage'; // 暂时不使用国际化
import { IconChartBar, IconClock, IconChevronDown } from '@tabler/icons-react';
import { API } from 'utils/api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ModelUsageChart = () => {
  const theme = useTheme();
  // const { t } = useLanguage(); // 暂时不使用国际化
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usageData, setUsageData] = useState([]);
  // 移除图表类型选择，只保留柱状图
  const [timeRange, setTimeRange] = useState(7); // 默认7天

  // 生成虚拟使用量数据
  useEffect(() => {
    const generateMockData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取真实的模型列表
        const response = await API.get('/api/user/modelbilling');
        const { success, data } = response.data;

        let modelNames = [];
        if (success && Array.isArray(data)) {
          // 提取模型名称
          modelNames = data.map(item => item.model).slice(0, 15);
        }

        // 使用硬编码的模型列表
        modelNames = [
          'gemini-2.5-pro',
          'gemini-2.5-pro-preview-03-25',
          'gemini-2.5-pro-preview-05-06',
          'gemini-2.5-pro-preview-06-05',
          'claude-sonnet-4-20250514',
          'claude-3-7-sonnet-20250219',
          'claude-opus-4-20250514',
          'claude-sonnet-4-20250514-thinking',
          'claude-opus-4-1-20250805',
          'claude-opus-4-1-20250805-thinking',
          'gemini-2.5-flash',
          'gemini-2.5-flash-preview-04-17'
        ];

        // 生成虚拟数据，调用次数为具体随机数字
        const mockData = modelNames.map((modelName) => {
          // 根据时间范围调整数据规模
          const baseMultiplier = timeRange === 1 ? 0.1 : timeRange === 7 ? 0.5 : timeRange === 30 ? 2 : 5;

          // 生成具体的随机调用次数（如123421这样的数字）
          const minCount = Math.floor(10000 * baseMultiplier);
          const maxCount = Math.floor(500000 * baseMultiplier);
          const count = Math.floor(Math.random() * (maxCount - minCount) + minCount);

          // 格式化显示（如果大于1万则显示为万单位）
          const countDisplay = count >= 10000
            ? `${Math.floor(count / 10000)}万${count % 10000 > 0 ? '+' : ''}`
            : count.toLocaleString();

          return {
            model_name: modelName,
            count: count,
            count_display: countDisplay,
            count_formatted: count.toLocaleString()
          };
        });

        // 筛选并排序：只保留包含 Gemini 和 Claude 关键字的模型
        const filteredData = mockData.filter(model => {
          const modelName = model.model_name.toLowerCase();
          return modelName.includes('gemini') || modelName.includes('claude');
        });

        const sortedData = filteredData.sort((a, b) => {
          const aHasGemini = a.model_name.toLowerCase().includes('gemini');
          const bHasGemini = b.model_name.toLowerCase().includes('gemini');

          // Gemini 模型优先，然后是 Claude 模型
          if (aHasGemini && !bHasGemini) return -1;
          if (!aHasGemini && bHasGemini) return 1;

          // 在同类模型中按调用次数排序
          return b.count - a.count;
        });

        setUsageData(sortedData);
      } catch (err) {
        console.error('生成模拟数据失败:', err);
        // 硬编码的模型列表
        const fallbackModels = [
          'gemini-2.5-pro',
          'gemini-2.5-pro-preview-03-25',
          'gemini-2.5-pro-preview-05-06',
          'gemini-2.5-pro-preview-06-05',
          'claude-sonnet-4-20250514',
          'claude-3-7-sonnet-20250219',
          'claude-opus-4-20250514',
          'claude-sonnet-4-20250514-thinking',
          'claude-opus-4-1-20250805',
          'claude-opus-4-1-20250805-thinking',
          'gemini-2.5-flash',
          'gemini-2.5-flash-preview-04-17'
        ];

        const fallbackData = fallbackModels.map((modelName) => {
          // 生成具体的随机调用次数
          const minCount = 15000;
          const maxCount = 450000;
          const count = Math.floor(Math.random() * (maxCount - minCount) + minCount);

          // 格式化显示
          const countDisplay = count >= 10000
            ? `${Math.floor(count / 10000)}万${count % 10000 > 0 ? '+' : ''}`
            : count.toLocaleString();

          return {
            model_name: modelName,
            count: count,
            count_display: countDisplay,
            count_formatted: count.toLocaleString()
          };
        });

        // 筛选并排序：只保留包含 Gemini 和 Claude 关键字的模型
        const filteredFallbackData = fallbackData.filter(model => {
          const modelName = model.model_name.toLowerCase();
          return modelName.includes('gemini') || modelName.includes('claude');
        });

        const sortedFallbackData = filteredFallbackData.sort((a, b) => {
          const aHasGemini = a.model_name.toLowerCase().includes('gemini');
          const bHasGemini = b.model_name.toLowerCase().includes('gemini');

          // Gemini 模型优先，然后是 Claude 模型
          if (aHasGemini && !bHasGemini) return -1;
          if (!aHasGemini && bHasGemini) return 1;

          // 在同类模型中按调用次数排序
          return b.count - a.count;
        });

        setUsageData(sortedFallbackData);
      } finally {
        setLoading(false);
      }
    };

    // 模拟加载时间
    setTimeout(generateMockData, 800);
  }, [timeRange]);

  // 饼图颜色配置 - 多种颜色
  const pieColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f',
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ];

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            boxShadow: theme.shadows[8]
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              调用次数: {entry.payload.count_formatted}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };



  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 标题区域 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary
            }}
          >
            📊 模型使用量统计
          </Typography>

        </Box>

        {/* 控制面板 */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
            borderRadius: 0
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconChartBar size={24} color={theme.palette.primary.main} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                模型调用次数统计
              </Typography>
            </Box>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>时间范围</InputLabel>
              <Select
                value={timeRange}
                label="时间范围"
                onChange={(e) => setTimeRange(e.target.value)}
                startAdornment={<IconClock size={20} />}
              >
                <MenuItem value={1}>最近1天</MenuItem>
                <MenuItem value={7}>最近7天</MenuItem>
                <MenuItem value={30}>最近30天</MenuItem>
                <MenuItem value={90}>最近90天</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* 左右布局：柱状图在左，模型列表在右 */}
        <Grid container spacing={3}>
          {/* 左侧：饼图 */}
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                p: 3,
                backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                height: 600,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          ) : usageData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                暂无使用数据
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: 500, flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}
            </Box>
          </Grid>

          {/* 右侧：模型列表 */}
          <Grid item xs={12} lg={4}>
            {!loading && !error && usageData.length > 0 && (
              <Box
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                  height: 600,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
            <Accordion
              defaultExpanded
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                boxShadow: 'none',
                '&:before': {
                  display: 'none'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<IconChevronDown />}
                sx={{
                  backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0'}`,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#111111' : '#f5f5f5'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                  🔥 热门模型排行榜
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
                  {usageData.map((model, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        mb: 1,
                        borderRadius: 0,
                        backgroundColor: theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0'}`,
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#111111' : '#f5f5f5'
                        },
                        '&:last-child': {
                          mb: 0
                        }
                      }}
                    >
                      {/* 排名和模型名 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#666666',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#ffffff',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {model.model_name}
                            {(model.model_name.toLowerCase().includes('gemini') || model.model_name.toLowerCase().includes('claude')) && (
                              <Box
                                component="span"
                                sx={{
                                  ml: 1,
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 1,
                                  backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0',
                                  color: theme.palette.text.primary,
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}
                              >
                                🔥 热门
                              </Box>
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 调用次数 */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.text.primary
                        }}
                      >
                        {model.count_formatted}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* 查看更多模型按钮 */}
                <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0'}` }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => window.open('/pricing', '_blank')}
                    sx={{
                      borderColor: theme.palette.text.primary,
                      color: theme.palette.text.primary,
                      '&:hover': {
                        borderColor: theme.palette.text.primary,
                        backgroundColor: theme.palette.mode === 'dark' ? '#111111' : '#f5f5f5'
                      }
                    }}
                  >
                    查看更多模型 →
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
              </Box>
            )}
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default ModelUsageChart;
