import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from 'hooks/useLanguage';
import SEOHead from 'ui-component/SEOHead';
// import PricingSection from './PricingSection'; // 暂时注释，准备替换为使用量图表
import ModelUsageChart from './ModelUsageChart';

// 图标导入
import {
  IconRocket,
  IconShield,
  IconCurrencyDollar,
  IconBolt,
  IconBrain,
  IconCode,
  IconLanguage,
  IconPalette,
  IconChartBar,
  IconUsers,
  IconServer,
  IconClock,
} from '@tabler/icons-react';

const ModernHomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // 动画变体
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // 特性数据
  const features = [
    {
      icon: <IconCurrencyDollar size={40} />,
      title: t('features.cost.title'),
      description: t('features.cost.desc'),
      color: theme.palette.success.main,
    },
    {
      icon: <IconBolt size={40} />,
      title: t('features.speed.title'),
      description: t('features.speed.desc'),
      color: theme.palette.warning.main,
    },
    {
      icon: <IconBrain size={40} />,
      title: t('features.models.title'),
      description: t('features.models.desc'),
      color: theme.palette.primary.main,
    },
    {
      icon: <IconShield size={40} />,
      title: t('features.support.title'),
      description: t('features.support.desc'),
      color: theme.palette.secondary.main,
    },
  ];

  // 统计数据
  const stats = [
    {
      number: '200+',
      label: t('stats.models'),
      icon: <IconServer size={24} />,
    },
    { number: '50K+', label: t('stats.users'), icon: <IconUsers size={24} /> },
    {
      number: '1M+',
      label: t('stats.requests'),
      icon: <IconChartBar size={24} />,
    },
    {
      number: '99.9%',
      label: t('stats.uptime'),
      icon: <IconClock size={24} />,
    },
  ];

  // 应用场景
  const applications = [
    {
      icon: <IconLanguage size={32} />,
      title: t('applications.chat.title'),
      description: t('applications.chat.desc'),
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <IconCode size={32} />,
      title: t('applications.code.title'),
      description: t('applications.code.desc'),
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: <IconLanguage size={32} />,
      title: t('applications.translate.title'),
      description: t('applications.translate.desc'),
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      icon: <IconPalette size={32} />,
      title: t('applications.creative.title'),
      description: t('applications.creative.desc'),
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  return (
    <>
      <SEOHead />
      <Box sx={{ overflow: 'hidden' }}>
        {/* 英雄区域 */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial='initial'
              animate='animate'
              variants={staggerContainer}
            >
              <Grid container spacing={4} alignItems='center'>
                <Grid item xs={12} md={6}>
                  <motion.div variants={fadeInUp}>
                    <Typography
                      variant='h1'
                      sx={{
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        fontWeight: 800,
                        mb: 2,
                        background:
                          theme.palette.mode === 'dark'
                            ? 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)'
                            : 'linear-gradient(45deg, #1e40af 30%, #7c3aed 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {t('home.title')}
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Typography
                      variant='h4'
                      sx={{
                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                        color: theme.palette.text.primary,
                        mb: 3,
                        fontWeight: 400,
                      }}
                    >
                      {t('home.subtitle')}
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Typography
                      variant='body1'
                      sx={{
                        fontSize: '1.1rem',
                        color: theme.palette.text.secondary,
                        mb: 3,
                        lineHeight: 1.6,
                      }}
                    >
                      {t('home.description')}
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Typography
                      variant='body1'
                      sx={{
                        fontSize: '1rem',
                        color: theme.palette.text.secondary,
                        mb: 4,
                        lineHeight: 1.8,
                        opacity: 0.9,
                      }}
                    >
                      我们致力于为开发者提供最优质的AI服务体验。无论您是在开发智能聊天机器人、代码助手，还是创意生成应用，我们都能为您提供稳定、高效、经济的解决方案。
                    </Typography>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button
                        variant='contained'
                        size='large'
                        startIcon={<IconRocket />}
                        onClick={() => navigate('/register')}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          background:
                            'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.6)',
                            background:
                              'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {t('home.cta.start')}
                      </Button>

                      <Button
                        variant='outlined'
                        size='large'
                        onClick={() => navigate('/about')}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            borderColor: theme.palette.primary.dark,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {t('home.cta.docs')}
                      </Button>
                    </Stack>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <motion.div variants={fadeInUp}>
                    <Box sx={{ pl: { md: 4 } }}>
                      {/* 核心优势 */}
                      <Typography
                        variant='h5'
                        sx={{
                          fontWeight: 600,
                          mb: 3,
                          color: theme.palette.primary.main,
                        }}
                      >
                        🚀 核心优势
                      </Typography>

                      <Stack spacing={2} sx={{ mb: 4 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.primary.main,
                              mt: 1,
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant='body1' sx={{ lineHeight: 1.6 }}>
                            <strong>统一接口</strong> -
                            一个API密钥访问所有主流AI模型
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.secondary.main,
                              mt: 1,
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant='body1' sx={{ lineHeight: 1.6 }}>
                            <strong>高性价比</strong> -
                            比官方价格更优惠，按需付费无最低消费
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.success.main,
                              mt: 1,
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant='body1' sx={{ lineHeight: 1.6 }}>
                            <strong>稳定可靠</strong> -
                            99.9%服务可用性，全球CDN加速
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.warning.main,
                              mt: 1,
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant='body1' sx={{ lineHeight: 1.6 }}>
                            <strong>开发友好</strong> -
                            完整文档，丰富示例，快速集成
                          </Typography>
                        </Box>
                      </Stack>

                      {/* 支持的应用 */}
                      <Typography
                        variant='h6'
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: theme.palette.text.primary,
                        }}
                      >
                        💡 适用场景
                      </Typography>

                      <Typography
                        variant='body2'
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.6,
                        }}
                      >
                        SillyTavern • Cursor • Cline • Continue • Omate • Tavo •
                        Claude Code • Gemini CLI • 以及更多AI应用...
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          </Container>
        </Box>

        {/* 统计数据区域 */}
        <Box
          sx={{
            py: 8,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : '#f8fafc',
          }}
        >
          <Container maxWidth='lg'>
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        height: '100%',
                        background:
                          theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                            : 'linear-gradient(135deg, #fff 0%, #f1f5f9 100%)',
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[8],
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                        {stat.icon}
                      </Box>
                      <Typography
                        variant='h3'
                        sx={{
                          fontWeight: 800,
                          color: theme.palette.primary.main,
                          mb: 1,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* 特性展示区域 */}
        <Box sx={{ py: 10 }}>
          <Container maxWidth='lg'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant='h2'
                align='center'
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #fff 30%, #e0e7ff 90%)'
                      : 'linear-gradient(45deg, #1e293b 30%, #475569 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('features.title')}
              </Typography>
              <Typography
                variant='h6'
                align='center'
                color='text.secondary'
                sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
              >
                {t('features.subtitle')}
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        p: 4,
                        height: '100%',
                        background:
                          theme.palette.mode === 'dark'
                            ? `linear-gradient(135deg, ${alpha(
                                feature.color,
                                0.1
                              )} 0%, ${alpha(
                                theme.palette.background.paper,
                                0.8
                              )} 100%)`
                            : `linear-gradient(135deg, ${alpha(
                                feature.color,
                                0.05
                              )} 0%, #fff 100%)`,
                        border: `1px solid ${alpha(feature.color, 0.2)}`,
                        borderRadius: 3,
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                          borderColor: alpha(feature.color, 0.4),
                        },
                        transition: 'all 0.4s ease',
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${
                            feature.color
                          }, ${alpha(feature.color, 0.8)})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          mb: 3,
                          boxShadow: `0 8px 24px ${alpha(feature.color, 0.3)}`,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant='h5'
                        sx={{ fontWeight: 600, mb: 2, color: feature.color }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant='body1'
                        color='text.secondary'
                        sx={{ lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* 应用场景区域 */}
        <Box
          sx={{
            py: 10,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? theme.palette.background.paper
                : '#f8fafc',
          }}
        >
          <Container maxWidth='lg'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant='h2'
                align='center'
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #fff 30%, #e0e7ff 90%)'
                      : 'linear-gradient(45deg, #1e293b 30%, #475569 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('applications.title')}
              </Typography>
              <Typography
                variant='h6'
                align='center'
                color='text.secondary'
                sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
              >
                {t('applications.subtitle')}
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {applications.map((app, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        p: 3,
                        height: '100%',
                        textAlign: 'center',
                        background:
                          theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                            : '#fff',
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                        borderRadius: 3,
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[12],
                        },
                        transition: 'all 0.4s ease',
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: app.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          mx: 'auto',
                          mb: 3,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        }}
                      >
                        {app.icon}
                      </Box>
                      <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                        {app.title}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ lineHeight: 1.6 }}
                      >
                        {app.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* 模型使用量图表区域 */}
        <ModelUsageChart />
      </Box>
    </>
  );
};

export default ModernHomePage;
