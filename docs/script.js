// Initialize data arrays
document.addEventListener('DOMContentLoaded', () => {
  let posts = [];
  let visitors = [];
  let newsletter = [];
  let competitors = [];

  // Set default date range
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 30);

  document.getElementById('startDate').valueAsDate = startDate;
  document.getElementById('endDate').valueAsDate = today;

  // Load data from localStorage
  function loadData() {
    try {
      const savedData = localStorage.getItem('linkedinAnalyticsData');
      if (savedData) {
        const data = JSON.parse(savedData);
        posts = data.posts || [];
        visitors = data.visitors || [];
        newsletter = data.newsletter || [];
        competitors = data.competitors || [];
        return true;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    return false;
  }

  // Check if data was intentionally cleared
  function wasDataCleared() {
    return localStorage.getItem('dataWasCleared') === 'true';
  }

  // Save data to localStorage
  function saveData() {
    try {
      const data = {
        posts: posts,
        visitors: visitors,
        newsletter: newsletter,
        competitors: competitors,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('linkedinAnalyticsData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Your browser storage might be full.');
    }
  }

  // Tab switching functionality
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and content
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Button event listeners
  document.getElementById('addPostBtn').addEventListener('click', addPost);
  document.getElementById('addVisitorBtn').addEventListener('click', addVisitorData);
  document.getElementById('addNewsletterBtn').addEventListener('click', addNewsletterData);
  document.getElementById('addCompetitorBtn').addEventListener('click', addCompetitor);
  document.getElementById('applyDateFilter').addEventListener('click', filterByDate);
  document.getElementById('exportCSV').addEventListener('click', exportToCSV);
  document.getElementById('exportJSON').addEventListener('click', exportToJSON);
  document.getElementById('exportPDF').addEventListener('click', exportToPDF);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importFromJSON);
  document.getElementById('clearDataBtn').addEventListener('click', clearAllData);

  // Initialize with sample data only if no data exists and wasn't intentionally cleared
  function initializeSampleData() {
    // Don't initialize if data was intentionally cleared
    if (wasDataCleared()) {
      return;
    }

    // Only initialize if no data exists in localStorage
    if (posts.length === 0) {
      posts = [
        { date: '2023-10-15', impressions: 12450, reactions: 842, comments: 124, reposts: 56 },
        { date: '2023-10-08', impressions: 9870, reactions: 612, comments: 98, reposts: 42 },
        { date: '2023-10-01', impressions: 11230, reactions: 684, comments: 87, reposts: 39 },
      ];
    }

    // Only initialize if no competitors exist
    if (competitors.length === 0) {
      competitors = [
        { name: 'Tech Innovators Inc.', followers: 45230, posts: 124, engagement: 4.2 },
        { name: 'Digital Solutions Ltd.', followers: 38750, posts: 98, engagement: 3.8 },
        { name: 'Future Tech Group', followers: 32180, posts: 156, engagement: 5.1 },
        { name: 'Growth Marketing Co.', followers: 28940, posts: 87, engagement: 4.7 },
        { name: 'Social Media Experts', followers: 25670, posts: 112, engagement: 3.9 },
      ];
    }

    saveData();
    updateDashboard();
    updateTopPosts();
    updateCompetitorsList();
    updateStorageInfo();
  }

  // Functions for data management
  function addPost() {
    const date = document.getElementById('postDate').value;
    if (!date) {
      alert('Please enter a date');
      return;
    }

    const post = {
      date: date,
      impressions: parseInt(document.getElementById('impressions').value) || 0,
      reactions: parseInt(document.getElementById('reactions').value) || 0,
      comments: parseInt(document.getElementById('comments').value) || 0,
      reposts: parseInt(document.getElementById('reposts').value) || 0,
    };

    posts.push(post);

    // Clear the "data was cleared" flag since we're adding new data
    localStorage.removeItem('dataWasCleared');

    saveData();
    updateDashboard();
    updateTopPosts();
    updateStorageInfo();
    clearPostForm();
    alert('Post data added successfully!');
  }

  function addVisitorData() {
    const date = document.getElementById('visitorDate').value;
    if (!date) {
      alert('Please enter a date');
      return;
    }

    const visitor = {
      date: date,
      pageViews: parseInt(document.getElementById('pageViewsInput').value) || 0,
      uniqueVisitors: parseInt(document.getElementById('uniqueVisitorsInput').value) || 0,
      buttonClicks: parseInt(document.getElementById('buttonClicksInput').value) || 0,
      totalFollowers: parseInt(document.getElementById('totalFollowersInput').value) || 0,
      newFollowers: parseInt(document.getElementById('newFollowersInput').value) || 0,
    };

    visitors.push(visitor);

    // Clear the "data was cleared" flag since we're adding new data
    localStorage.removeItem('dataWasCleared');

    saveData();
    updateDashboard();
    updateStorageInfo();
    clearVisitorForm();
    alert('Visitor data added successfully!');
  }

  function addNewsletterData() {
    const date = document.getElementById('newsletterDate').value;
    if (!date) {
      alert('Please enter a date');
      return;
    }

    const news = {
      date: date,
      articleViews: parseInt(document.getElementById('articleViewsInput').value) || 0,
      newSubscribers: parseInt(document.getElementById('newSubscribersInput').value) || 0,
    };

    newsletter.push(news);

    // Clear the "data was cleared" flag since we're adding new data
    localStorage.removeItem('dataWasCleared');

    saveData();
    updateDashboard();
    updateStorageInfo();
    clearNewsletterForm();
    alert('Newsletter data added successfully!');
  }

  function addCompetitor() {
    const name = document.getElementById('competitorName').value;
    if (!name) {
      alert('Please enter competitor name');
      return;
    }

    const competitor = {
      name: name,
      followers: parseInt(document.getElementById('competitorFollowers').value) || 0,
      posts: parseInt(document.getElementById('competitorPosts').value) || 0,
      engagement: parseFloat(document.getElementById('competitorEngagement').value) || 0,
    };

    competitors.push(competitor);

    // Clear the "data was cleared" flag since we're adding new data
    localStorage.removeItem('dataWasCleared');

    saveData();
    updateCompetitorsList();
    updateStorageInfo();
    clearCompetitorForm();
    alert('Competitor added successfully!');
  }

  function updateDashboard() {
    // Calculate metrics
    const totalImpressions = posts.reduce((sum, p) => sum + p.impressions, 0);
    const totalReactions = posts.reduce((sum, p) => sum + p.reactions, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
    const totalReposts = posts.reduce((sum, p) => sum + p.reposts, 0);
    const totalEngagement = totalReactions + totalComments + totalReposts;
    const engagementRate =
      totalImpressions > 0 ? ((totalEngagement / totalImpressions) * 100).toFixed(2) : 0;

    // Update dashboard values
    document.getElementById('totalImpressions').textContent = totalImpressions.toLocaleString();
    document.getElementById('totalReactions').textContent = totalReactions.toLocaleString();
    document.getElementById('totalComments').textContent = totalComments.toLocaleString();
    document.getElementById('totalReposts').textContent = totalReposts.toLocaleString();
    document.getElementById('engagementRate').textContent = engagementRate + '%';
    document.getElementById('myTotalPosts').textContent = posts.length;

    // Update visitor metrics
    if (visitors.length > 0) {
      const latestVisitor = visitors[visitors.length - 1];
      const totalPageViews = visitors.reduce((sum, v) => sum + v.pageViews, 0);
      const totalUniqueVisitors = visitors.reduce((sum, v) => sum + v.uniqueVisitors, 0);
      const totalButtonClicks = visitors.reduce((sum, v) => sum + v.buttonClicks, 0);
      const totalFollowers = latestVisitor.totalFollowers;
      const newFollowers = latestVisitor.newFollowers;

      document.getElementById('pageViews').textContent = totalPageViews.toLocaleString();
      document.getElementById('uniqueVisitors').textContent = totalUniqueVisitors.toLocaleString();
      document.getElementById('buttonClicks').textContent = totalButtonClicks.toLocaleString();
      document.getElementById('totalFollowers').textContent = totalFollowers.toLocaleString();
      document.getElementById('followersChange').textContent = '+' + newFollowers;
    } else {
      document.getElementById('pageViews').textContent = '0';
      document.getElementById('uniqueVisitors').textContent = '0';
      document.getElementById('buttonClicks').textContent = '0';
      document.getElementById('totalFollowers').textContent = '0';
      document.getElementById('followersChange').textContent = '+0';
    }

    // Update newsletter metrics
    if (newsletter.length > 0) {
      const totalArticleViews = newsletter.reduce((sum, n) => sum + n.articleViews, 0);
      const totalNewSubscribers = newsletter.reduce((sum, n) => sum + n.newSubscribers, 0);

      document.getElementById('articleViews').textContent = totalArticleViews.toLocaleString();
      document.getElementById('newSubscribers').textContent = totalNewSubscribers.toLocaleString();
    } else {
      document.getElementById('articleViews').textContent = '0';
      document.getElementById('newSubscribers').textContent = '0';
    }

    // Calculate changes - each metric shows 0% if its specific data source is empty
    // Post-related metrics
    if (posts.length === 0) {
      document.getElementById('impressionsChange').textContent = '+0%';
      document.getElementById('reactionsChange').textContent = '+0%';
      document.getElementById('commentsChange').textContent = '+0%';
      document.getElementById('repostsChange').textContent = '+0%';
      document.getElementById('postsChange').textContent = '+0';
      document.getElementById('engagementChange').textContent = '+0%';
    } else {
      // Show demo percentages when there is post data
      document.getElementById('impressionsChange').textContent = '+12.5%';
      document.getElementById('reactionsChange').textContent = '+8.3%';
      document.getElementById('commentsChange').textContent = '+5.7%';
      document.getElementById('repostsChange').textContent = '+10.2%';
      document.getElementById('postsChange').textContent = '+' + posts.length;
      document.getElementById('engagementChange').textContent = '+1.8%';
    }

    // Visitor-related metrics
    if (visitors.length === 0) {
      document.getElementById('viewsChange').textContent = '+0%';
      document.getElementById('visitorsChange').textContent = '+0%';
      document.getElementById('clicksChange').textContent = '+0%';
    } else {
      // Show demo percentages when there is visitor data
      document.getElementById('viewsChange').textContent = '+7.8%';
      document.getElementById('visitorsChange').textContent = '+6.4%';
      document.getElementById('clicksChange').textContent = '+9.1%';
    }

    // Newsletter-related metrics
    if (newsletter.length === 0) {
      document.getElementById('articleChange').textContent = '+0%';
      document.getElementById('subscribersChange').textContent = '+0%';
    } else {
      // Show demo percentages when there is newsletter data
      document.getElementById('articleChange').textContent = '+11.3%';
      document.getElementById('subscribersChange').textContent = '+14.2%';
    }
  }

  function updateTopPosts() {
    const container = document.getElementById('topPostsContainer');
    container.innerHTML = '';

    if (posts.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: var(--gray); padding: 20px;">No posts added yet. Add your first post in the Input Data tab!</p>';
      return;
    }

    // Calculate engagement rate for each post and sort by it
    const postsWithEngagement = posts
      .map((post) => {
        const engagement =
          post.impressions > 0
            ? (((post.reactions + post.comments + post.reposts) / post.impressions) * 100).toFixed(
                2
              )
            : 0;
        return { ...post, engagement };
      })
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10);

    postsWithEngagement.forEach((post) => {
      const postCard = document.createElement('div');
      postCard.className = 'post-card';
      postCard.innerHTML = `
                    <div class="post-header">
                        <div class="post-date">${post.date}</div>
                        <div class="post-engagement">Engagement Rate: ${post.engagement}%</div>
                    </div>
                    <div class="post-metrics">
                        <div class="post-metric">
                            <div class="post-metric-label">Impressions</div>
                            <div class="post-metric-value">${post.impressions.toLocaleString()}</div>
                        </div>
                        <div class="post-metric">
                            <div class="post-metric-label">Reactions</div>
                            <div class="post-metric-value">${post.reactions.toLocaleString()}</div>
                        </div>
                        <div class="post-metric">
                            <div class="post-metric-label">Comments</div>
                            <div class="post-metric-value">${post.comments.toLocaleString()}</div>
                        </div>
                        <div class="post-metric">
                            <div class="post-metric-label">Reposts</div>
                            <div class="post-metric-value">${post.reposts.toLocaleString()}</div>
                        </div>
                    </div>
                `;
      container.appendChild(postCard);
    });
  }

  function updateCompetitorsList() {
    const container = document.getElementById('competitorsList');
    container.innerHTML = '';

    if (competitors.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: var(--gray); padding: 20px;">No competitors added yet.</p>';
      return;
    }

    // Sort competitors by followers (descending)
    const sortedCompetitors = [...competitors]
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 5);

    sortedCompetitors.forEach((comp, index) => {
      const competitorCard = document.createElement('div');
      competitorCard.className = 'competitor-card';
      competitorCard.innerHTML = `
                    <div class="competitor-info">
                        <div class="competitor-name">#${index + 1} ${comp.name}</div>
                        <div class="competitor-metrics">
                            <div><span class="metric-label">Followers:</span> ${comp.followers.toLocaleString()}</div>
                            <div><span class="metric-label">Posts:</span> ${comp.posts}</div>
                            <div><span class="metric-label">Engagement:</span> ${
                              comp.engagement
                            }%</div>
                        </div>
                    </div>
                    <div class="competitor-rank">${index + 1}</div>
                `;
      container.appendChild(competitorCard);
    });
  }

  function clearPostForm() {
    document.getElementById('postDate').value = '';
    document.getElementById('impressions').value = '';
    document.getElementById('reactions').value = '';
    document.getElementById('comments').value = '';
    document.getElementById('reposts').value = '';
  }

  function clearVisitorForm() {
    document.getElementById('visitorDate').value = '';
    document.getElementById('pageViewsInput').value = '';
    document.getElementById('uniqueVisitorsInput').value = '';
    document.getElementById('buttonClicksInput').value = '';
    document.getElementById('totalFollowersInput').value = '';
    document.getElementById('newFollowersInput').value = '';
  }

  function clearNewsletterForm() {
    document.getElementById('newsletterDate').value = '';
    document.getElementById('articleViewsInput').value = '';
    document.getElementById('newSubscribersInput').value = '';
  }

  function clearCompetitorForm() {
    document.getElementById('competitorName').value = '';
    document.getElementById('competitorFollowers').value = '';
    document.getElementById('competitorPosts').value = '';
    document.getElementById('competitorEngagement').value = '';
  }

  function filterByDate() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    // In a real implementation, this would filter the data
    alert(
      `Filtering data from ${startDate} to ${endDate}\n\nThis feature would filter all metrics and posts based on the selected date range.`
    );
  }

  function exportToCSV() {
    let csv = 'Date,Impressions,Reactions,Comments,Reposts,Engagement Rate\n';

    posts.forEach((post) => {
      const engagement = (
        ((post.reactions + post.comments + post.reposts) / post.impressions) *
        100
      ).toFixed(2);
      csv += `${post.date},${post.impressions},${post.reactions},${post.comments},${post.reposts},${engagement}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin_analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert('CSV file downloaded successfully!');
  }

  function exportToJSON() {
    const data = {
      posts: posts,
      visitors: visitors,
      newsletter: newsletter,
      competitors: competitors,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert('Backup file downloaded successfully! Keep this file safe.');
  }

  function exportToPDF() {
    alert(
      'PDF export would require a library like jsPDF. For now, use Print (Ctrl+P) to save as PDF.'
    );
    window.print();
  }

  function importFromJSON() {
    const file = document.getElementById('importFile').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);

        if (confirm('This will replace all current data. Continue?')) {
          posts = data.posts || [];
          visitors = data.visitors || [];
          newsletter = data.newsletter || [];
          competitors = data.competitors || [];

          // Clear the "data was cleared" flag since we're importing data
          localStorage.removeItem('dataWasCleared');

          saveData();
          updateDashboard();
          updateTopPosts();
          updateCompetitorsList();
          updateStorageInfo();

          alert('Data imported successfully!');
        }
      } catch (error) {
        alert("Error importing file. Please make sure it's a valid backup file.");
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  }

  function updateStorageInfo() {
    document.getElementById('postsCount').textContent = posts.length;
    document.getElementById('visitorsCount').textContent = visitors.length;
    document.getElementById('competitorsCount').textContent = competitors.length;
  }

  function clearAllData() {
    if (
      confirm(
        '⚠️ WARNING: This will permanently delete all your data!\n\nMake sure you have a backup first. Continue?'
      )
    ) {
      posts = [];
      visitors = [];
      newsletter = [];
      competitors = [];

      // Set flag to indicate data was intentionally cleared
      localStorage.setItem('dataWasCleared', 'true');

      saveData();
      updateDashboard();
      updateTopPosts();
      updateCompetitorsList();
      updateStorageInfo();

      // Clear forms
      clearPostForm();
      clearVisitorForm();
      clearNewsletterForm();
      clearCompetitorForm();

      alert('All data has been cleared! Dashboard now shows all zeros.');
    }
  }

  // Initialize the application
  const hasExistingData = loadData();
  if (!hasExistingData) {
    initializeSampleData();
  } else {
    updateDashboard();
    updateTopPosts();
    updateCompetitorsList();
    updateStorageInfo();
  }
});
