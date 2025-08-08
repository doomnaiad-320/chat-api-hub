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
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
// import { useLanguage } from 'hooks/useLanguage'; // 暂时不使用国际化
import { IconChartBar, IconClock, IconChevronDown } from '@tabler/icons-react';
import { API } from 'utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. 调用 public pricing 接口获取模型列表
        const response = await API.get('/api/modelbilling');
        const { success, data } = response.data;

        if (success && Array.isArray(data)) {
          // 2. 生成虚拟使用量
          const virtualData = data.map((model) => {
            const baseMultiplier =
              timeRange === 1
                ? 0.1
                : timeRange === 7
                ? 0.5
                : timeRange === 30
                ? 2
                : 5;
            const minCount = Math.floor(10000 * baseMultiplier);
            const maxCount = Math.floor(500000 * baseMultiplier);
            const count = Math.floor(
              Math.random() * (maxCount - minCount) + minCount
            );

            return {
              ...model,
              count: count,
              count_formatted: count.toLocaleString(),
            };
          });

          // 3. 排序：Gemini 和 Claude 优先，然后按使用量排序
          const sortedData = virtualData.sort((a, b) => {
            const aName = a.model.toLowerCase();
            const bName = b.model.toLowerCase();
            const aIsPriority =
              aName.includes('gemini') || aName.includes('claude');
            const bIsPriority =
              bName.includes('gemini') || bName.includes('claude');

            if (aIsPriority && !bIsPriority) return -1;
            if (!aIsPriority && bIsPriority) return 1;
            return b.count - a.count;
          });

          setUsageData(sortedData);
        } else {
          setError('无法加载模型数据');
        }
      } catch (err) {
        setError('加载数据时发生错误');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            boxShadow: theme.shadows[8],
          }}
        >
          <Typography variant='subtitle2' sx={{ mb: 1 }}>
            {payload[0].payload.model}
          </Typography>
          <Typography variant='body2' sx={{ color: payload[0].color }}>
            调用次数: {payload[0].payload.count_formatted}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string,
        payload: PropTypes.shape({
          model: PropTypes.string,
          count_formatted: PropTypes.string,
        }),
      })
    ),
  };

  return (
    <Container maxWidth='xl' sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 标题区域 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant='h3'
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.text.primary,
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
            backgroundColor:
              theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
            borderRadius: 0,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            alignItems='center'
            justifyContent='space-between'
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconChartBar size={24} color={theme.palette.primary.main} />
              <Typography variant='h6' sx={{ fontWeight: 600 }}>
                模型调用次数统计
              </Typography>
            </Box>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>时间范围</InputLabel>
              <Select
                value={timeRange}
                label='时间范围'
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
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                height: 600,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400,
                  }}
                >
                  <CircularProgress size={60} />
                </Box>
              ) : error ? (
                <Alert severity='error' sx={{ mb: 4 }}>
                  {error}
                </Alert>
              ) : usageData.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant='h6' color='text.secondary'>
                    暂无使用数据
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ height: 500, flex: 1 }}>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={usageData.slice(0, 10)} // 只显示前10个
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='model'
                        angle={-45}
                        textAnchor='end'
                        height={100}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey='count' fill='#8884d8' name='调用次数' />
                    </BarChart>
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
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                  height: 600,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Accordion
                  defaultExpanded
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor:
                      theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                    boxShadow: 'none',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    sx={{
                      backgroundColor:
                        theme.palette.mode === 'dark' ? '#000000' : '#ffffff',
                      borderBottom: `1px solid ${
                        theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0'
                      }`,
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark' ? '#111111' : '#f5f5f5',
                      },
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                      }}
                    >
                      🔥 热门模型排行榜
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      p: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
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
                            backgroundColor:
                              theme.palette.mode === 'dark'
                                ? '#000000'
                                : '#ffffff',
                            borderBottom: `1px solid ${
                              theme.palette.mode === 'dark'
                                ? '#333333'
                                : '#e0e0e0'
                            }`,
                            '&:hover': {
                              backgroundColor:
                                theme.palette.mode === 'dark'
                                  ? '#111111'
                                  : '#f5f5f5',
                            },
                            '&:last-child': {
                              mb: 0,
                            },
                          }}
                        >
                          {/* 排名和模型名 */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor:
                                  theme.palette.mode === 'dark'
                                    ? '#333333'
                                    : '#666666',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color:
                                  theme.palette.mode === 'dark'
                                    ? '#ffffff'
                                    : '#ffffff',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Box>
                              <Typography
                                variant='body1'
                                sx={{ fontWeight: 600 }}
                              >
                                {model.model}
                                {(model.model
                                  .toLowerCase()
                                  .includes('gemini') ||
                                  model.model
                                    .toLowerCase()
                                    .includes('claude')) && (
                                  <Box
                                    component='span'
                                    sx={{
                                      ml: 1,
                                      px: 1,
                                      py: 0.25,
                                      borderRadius: 1,
                                      backgroundColor:
                                        theme.palette.mode === 'dark'
                                          ? '#333333'
                                          : '#e0e0e0',
                                      color: theme.palette.text.primary,
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
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
                            variant='h6'
                            sx={{
                              fontWeight: 700,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {model.count_formatted}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* 查看更多模型按钮 */}
                    <Box
                      sx={{
                        p: 2,
                        borderTop: `1px solid ${
                          theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0'
                        }`,
                      }}
                    >
                      <Button
                        variant='outlined'
                        fullWidth
                        onClick={() => window.open('/public-pricing', '_blank')}
                        sx={{
                          borderColor: theme.palette.text.primary,
                          color: theme.palette.text.primary,
                          '&:hover': {
                            borderColor: theme.palette.text.primary,
                            backgroundColor:
                              theme.palette.mode === 'dark'
                                ? '#111111'
                                : '#f5f5f5',
                          },
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
