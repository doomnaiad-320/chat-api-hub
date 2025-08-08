import { Helmet } from 'react-helmet-async';
import { useLanguage } from 'hooks/useLanguage';

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
}) => {
  const { t, currentLanguage } = useLanguage();

  // 使用传入的值或默认的翻译值
  const seoTitle = title || t('seo.title');
  const seoDescription = description || t('seo.description');
  const seoKeywords = keywords || t('seo.keywords');

  // 构建完整URL
  const fullUrl = url || window.location.href;
  const siteUrl = window.location.origin;
  const defaultImage = `${siteUrl}/logo192.png`;
  const seoImage = image || defaultImage;

  return (
    <Helmet>
      {/* 基础SEO */}
      <title>{seoTitle}</title>
      <meta name='description' content={seoDescription} />
      <meta name='keywords' content={seoKeywords} />
      <meta name='language' content={currentLanguage} />
      <html lang={currentLanguage} />

      {/* 防止索引 */}
      {noIndex && <meta name='robots' content='noindex,nofollow' />}

      {/* Open Graph / Facebook */}
      <meta property='og:type' content={type} />
      <meta property='og:url' content={fullUrl} />
      <meta property='og:title' content={seoTitle} />
      <meta property='og:description' content={seoDescription} />
      <meta property='og:image' content={seoImage} />
      <meta
        property='og:locale'
        content={currentLanguage === 'zh' ? 'zh_CN' : 'en_US'}
      />

      {/* Twitter */}
      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:url' content={fullUrl} />
      <meta property='twitter:title' content={seoTitle} />
      <meta property='twitter:description' content={seoDescription} />
      <meta property='twitter:image' content={seoImage} />

      {/* 额外的SEO标签 */}
      <meta name='author' content='AI Aggregation Platform' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />

      {/* 结构化数据 */}
      <script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: seoTitle,
          description: seoDescription,
          url: siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        })}
      </script>

      {/* 预连接到外部资源 */}
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='true'
      />

      {/* 网站图标 */}
      <link rel='icon' href='/favicon.ico' />
      <link rel='apple-touch-icon' href='/logo192.png' />
      <link rel='manifest' href='/manifest.json' />

      {/* 主题颜色 */}
      <meta name='theme-color' content='#1976d2' />
      <meta name='msapplication-TileColor' content='#1976d2' />
    </Helmet>
  );
};

export default SEOHead;
