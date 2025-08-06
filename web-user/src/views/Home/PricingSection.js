import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from 'hooks/useLanguage';
import { IconStar, IconTrendingUp, IconBrain } from '@tabler/icons-react';

const PricingSection = () => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(0);

  // 模型价格数据
  const modelCategories = [
    {
      name: '对话模型',
      nameEn: 'Chat Models',
      models: [
        {
          name: 'GPT-4o',
          provider: 'OpenAI',
          inputPrice: '$0.005',
          outputPrice: '$0.015',
          popular: true,
          description: '最新的GPT-4优化版本，性能卓越'
        },
        {
          name: 'Claude-3.5-Sonnet',
          provider: 'Anthropic',
          inputPrice: '$0.003',
          outputPrice: '$0.015',
          popular: true,
          description: '强大的推理能力，适合复杂任务'
        },
        {
          name: 'Gemini-1.5-Pro',
          provider: 'Google',
          inputPrice: '$0.0035',
          outputPrice: '$0.0105',
          popular: false,
          description: '支持长上下文，多模态能力强'
        },
        {
          name: 'GPT-3.5-Turbo',
          provider: 'OpenAI',
          inputPrice: '$0.0005',
          outputPrice: '$0.0015',
          popular: false,
          description: '经济实惠的选择，响应快速'
        }
      ]
    },
    {
      name: '代码模型',
      nameEn: 'Code Models',
      models: [
        {
          name: 'Claude-3-Haiku',
          provider: 'Anthropic',
          inputPrice: '$0.00025',
          outputPrice: '$0.00125',
          popular: true,
          description: '专为代码生成优化'
        },
        {
          name: 'GPT-4-Turbo',
          provider: 'OpenAI',
          inputPrice: '$0.01',
          outputPrice: '$0.03',
          popular: false,
          description: '强大的代码理解和生成能力'
        },
        {
          name: 'Codestral',
          provider: 'Mistral',
          inputPrice: '$0.001',
          outputPrice: '$0.003',
          popular: false,
          description: '专业的代码助手模型'
        }
      ]
    },
    {
      name: '创意模型',
      nameEn: 'Creative Models',
      models: [
        {
          name: 'DALL-E 3',
          provider: 'OpenAI',
          inputPrice: '$0.04',
          outputPrice: '-',
          popular: true,
          description: '高质量图像生成',
          unit: '每张图片'
        },
        {
          name: 'Midjourney',
          provider: 'Midjourney',
          inputPrice: '$0.08',
          outputPrice: '-',
          popular: true,
          description: '艺术风格图像生成',
          unit: '每张图片'
        },
        {
          name: 'Stable Diffusion',
          provider: 'Stability AI',
          inputPrice: '$0.02',
          outputPrice: '-',
          popular: false,
          description: '开源图像生成模型',
          unit: '每张图片'
        }
      ]
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
                  {modelCategories[selectedCategory].models.map((model, index) => (
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
                        <Typography variant="caption" color="text.secondary">
                          {model.unit || t('pricing.per1k')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.error.main }}>
                          {model.outputPrice}
                        </Typography>
                        {model.outputPrice !== '-' && (
                          <Typography variant="caption" color="text.secondary">
                            {model.unit || t('pricing.per1k')}
                          </Typography>
                        )}
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
          </Card>
        </motion.div>

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
