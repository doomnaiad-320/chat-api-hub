import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { showError, showNotice } from 'utils/common';
import { API } from 'utils/api';
import { marked } from 'marked';
import ModernHomePage from './ModernHomePage';
import { Box, Container } from '@mui/material';

const Home = () => {
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const account = useSelector((state) => state.account);

  const isUserLoggedIn = () => {
    return !!account.user;
  };

  const displayNotice = async () => {
    try {
      const res = await API.get('/api/notice');
      const { success, message, data } = res.data;
      if (success && data) {
        const htmlNotice = marked(data);
        showNotice(htmlNotice, true);
      } else if (!success) {
        showError(message);
      }
    } catch (error) {
      showError('无法加载公告');
    }
  };

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    try {
      const res = await API.get('/api/home_page_content');
      const { success, data } = res.data;
      if (success) {
        let content = data;
        if (!data.startsWith('https://')) {
          content = marked.parse(data);
        }
        setHomePageContent(content);
        localStorage.setItem('home_page_content', content);
      } else {
        // 如果没有自定义内容，使用现代化首页
        setHomePageContent('');
      }
    } catch (error) {
      // 如果API调用失败，使用现代化首页
      setHomePageContent('');
    }
    setHomePageContentLoaded(true);
  };

  const checkAndDisplayNotice = () => {
    if (!isUserLoggedIn()) {
      displayNotice();
    }
  };

  useEffect(() => {
    checkAndDisplayNotice();
    displayHomePageContent().then();
  }, []);

  return (
    <>
      {homePageContentLoaded && homePageContent === '' ? (
        <ModernHomePage />
      ) : (
        <>
          <Box>
            {homePageContent.startsWith('https://') ? (
              <iframe
                title='home_page_content'
                src={homePageContent}
                style={{ width: '100%', height: '100vh', border: 'none' }}
              />
            ) : (
              <>
                <Container>
                  <div
                    style={{ fontSize: 'larger' }}
                    dangerouslySetInnerHTML={{ __html: homePageContent }}
                  ></div>
                </Container>
              </>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default Home;
