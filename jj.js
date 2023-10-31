const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000;

app.use(express.json());

// Middleware to retrieve blog data and perform analytics
app.get('/api/blog-stats', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    const blogData = response.data;

    // Calculate the total number of blogs fetched.
    const totalBlogs = blogData.length;

    // Find the blog with the longest title.
    const longestTitleBlog = _.maxBy(blogData, 'title.length');

    // Determine the number of blogs with titles containing the word "privacy."
    const blogsWithPrivacy = _.filter(blogData, (blog) => _.includes(blog.title.toLowerCase(), 'privacy'));

    // Create an array of unique blog titles (no duplicates).
    const uniqueBlogTitles = _.uniqBy(blogData, 'title');

    res.json({
      totalBlogs,
      longestBlogTitle: longestTitleBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: uniqueBlogTitles.map(blog => blog.title)
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving and analyzing the data.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
