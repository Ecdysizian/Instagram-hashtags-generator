// Debug helpers
function debug(message) {
    console.log(`[InstagramHashtagGenerator] ${message}`);
  }
  
  debug('Script loaded');
  
  // Get elements
  const form = document.getElementById('hashtagForm');
  const generateBtn = document.getElementById('generateBtn');
  const resultContainer = document.getElementById('resultContainer');
  const hashtagsList = document.getElementById('hashtagsList');
  const loading = document.getElementById('loading');
  const csvBtn = document.getElementById('csvBtn');
  const csvActions = document.getElementById('csvActions');
  const downloadBtn = document.getElementById('downloadBtn');
  
  let generatedHashtags = [];
  let csvData = null;
  
  // Instagram hashtag database (simplified)
  const hashtagDatabase = {
      travel: ['#travel', '#wanderlust', '#travelgram', '#instatravel', '#travelphotography', '#natgeotravel', '#exploremore', '#travelblogger', '#traveltheworld', '#nomad', '#backpacking', '#vacation', '#adventure', '#globetrotter', '#passportready'],
      fitness: ['#fitness', '#fitfam', '#workout', '#gym', '#fitnessmotivation', '#training', '#health', '#fitlife', '#gains', '#exercise', '#strong', '#gymlife', '#weightloss', '#fitspo', '#bodybuilding'],
      food: ['#food', '#foodie', '#foodporn', '#instafood', '#foodphotography', '#yummy', '#delicious', '#foodlover', '#healthyfood', '#homemade', '#foodstagram', '#foodblogger', '#tasty', '#foodgasm', '#cooking'],
      fashion: ['#fashion', '#style', '#ootd', '#outfitoftheday', '#streetstyle', '#fashionblogger', '#instafashion', '#stylish', '#fashionista', '#trendy', '#lookbook', '#whatiwore', '#fashionstyle', '#clothes', '#moda'],
      beauty: ['#beauty', '#makeup', '#skincare', '#makeupaddict', '#makeuptutorial', '#makeuplover', '#instamakeup', '#makeupoftheday', '#beautytips', '#glam', '#cosmetics', '#selfcare', '#beautyblogger', '#makeupjunkie', '#skincareroutine'],
      art: ['#art', '#artist', '#artwork', '#drawing', '#painting', '#illustration', '#creative', '#instaart', '#artistsoninstagram', '#digitalart', '#sketch', '#artoftheday', '#contemporaryart', '#artsy', '#draw'],
      photography: ['#photography', '#photo', '#photographer', '#photooftheday', '#instagood', '#picoftheday', '#camera', '#instadaily', '#photoshoot', '#photogram', '#photographylovers', '#portrait', '#naturephotography', '#canon', '#nikon'],
      nature: ['#nature', '#naturelover', '#naturelovers', '#outdoors', '#landscape', '#naturephotography', '#mountains', '#wildlife', '#hiking', '#explore', '#wilderness', '#getoutside', '#environment', '#sunset', '#earthpix'],
      business: ['#business', '#entrepreneur', '#marketing', '#success', '#motivation', '#entrepreneurship', '#startup', '#smallbusiness', '#leadership', '#businessowner', '#mindset', '#inspiration', '#goals', '#hustle', '#entrepreneurlife'],
      technology: ['#technology', '#tech', '#innovation', '#digital', '#coding', '#programming', '#software', '#developer', '#computerscience', '#ai', '#machinelearning', '#cybersecurity', '#blockchain', '#iot', '#data'],
      education: ['#education', '#learning', '#student', '#study', '#school', '#college', '#university', '#teacher', '#teaching', '#knowledge', '#students', '#learn', '#onlinelearning', '#academics', '#edtech'],
      lifestyle: ['#lifestyle', '#life', '#inspiration', '#motivation', '#instagood', '#happy', '#love', '#positivevibes', '#mindfulness', '#selflove', '#dailylife', '#healthylifestyle', '#wellness', '#selfcare', '#mindset'],
      music: ['#music', '#musician', '#singer', '#band', '#concert', '#song', '#artist', '#guitar', '#hiphop', '#rap', '#producer', '#dj', '#livemusic', '#instamusic', '#musicproduction'],
      sports: ['#sports', '#athlete', '#basketball', '#football', '#soccer', '#baseball', '#tennis', '#golf', '#running', '#rugby', '#fitness', '#sportsphotography', '#training', '#sportsday', '#sportsnews'],
      pets: ['#pets', '#dog', '#cat', '#puppy', '#kitten', '#dogsofinstagram', '#catsofinstagram', '#animal', '#petsofinstagram', '#doglovers', '#catlovers', '#petstagram', '#rescuedog', '#adoptdontshop', '#cutepets'],
      wedding: ['#wedding', '#bride', '#groom', '#weddingday', '#weddingphotography', '#love', '#weddingdress', '#weddinginspiration', '#engaged', '#bridetobe', '#weddingplanner', '#weddingstyle', '#bridesmaids', '#weddingphotographer', '#weddingflowers']
  };
  
  // Additional hashtags for mixing
  const popularHashtags = ['#instagood', '#love', '#instagram', '#photooftheday', '#picoftheday', '#instadaily', '#follow', '#beautiful', '#like4like', '#followme', '#happy', '#bestoftheday', '#amazing', '#likeforlike', '#smile'];
  const nicheTags = ['#supportsmallbusiness', '#handcrafted', '#localbusiness', '#smallbusinessowner', '#creativepreneur', '#shoplocal', '#artisanal', '#craftsmanship', '#originaldesign', '#artistsofinstagram', '#handmadewithlove', '#creatoreconomy', '#independentartist', '#smallbatch', '#sustainablebusiness'];
  const popularityWords = ['trending', 'viral', 'featured', 'popular', 'famous', 'influencer', 'authentic', 'original', 'best', 'unique'];
  
  // Helper function to get more specific hashtags based on keywords
  function getSpecificHashtags(keywords) {
      let specific = [];
      
      keywords.forEach(keyword => {
          // Convert keyword to lowercase for consistency
          const kw = keyword.toLowerCase().trim();
          
          // Basic transformations
          specific.push(`#${kw}`);
          specific.push(`#${kw}lover`);
          specific.push(`#${kw}addict`);
          specific.push(`#${kw}life`);
          
          // Add some combinations with popularity words
          const randomPopWord = popularityWords[Math.floor(Math.random() * popularityWords.length)];
          specific.push(`#${kw}${randomPopWord}`);
      });
      
      return specific;
  }
  
  // Generate unique Instagram hashtags based on inputs
  function generateHashtags() {
      debug('Generate button clicked');
      
      // Show loading, hide results
      loading.style.display = 'block';
      resultContainer.style.display = 'none';
      hashtagsList.innerHTML = '';
      csvActions.style.display = 'none';
      downloadBtn.style.display = 'none';
      downloadBtn.href = '#';
  
      // Get form values
      const mainTopic = document.getElementById('mainTopic').value.trim().toLowerCase();
      const specificTagsInput = document.getElementById('specificTags').value;
      const specificTags = specificTagsInput ? specificTagsInput.split(',').map(k => k.trim()).filter(k => k) : [];
      const audienceSize = document.getElementById('audienceSize').value;
      const description = document.getElementById('contentDescription').value.trim();
  
      // Validate inputs
      if (!mainTopic || !description) {
          alert('Please fill in Main Topic and Content Description.');
          loading.style.display = 'none';
          return;
      }
  
      debug('Inputs: ' + mainTopic + ', ' + specificTags + ', ' + audienceSize + ', ' + description);
  
      // Generate hashtags
      try {
          let allHashtags = [];
          
          // Add main topic hashtags if available in our database
          if (hashtagDatabase[mainTopic]) {
              allHashtags = allHashtags.concat(hashtagDatabase[mainTopic]);
          } else {
              // If not in database, create some generic ones
              allHashtags.push(`#${mainTopic}`);
              allHashtags.push(`#${mainTopic}life`);
              allHashtags.push(`#${mainTopic}lover`);
              allHashtags.push(`#${mainTopic}daily`);
              allHashtags.push(`#${mainTopic}gram`);
          }
          
          // Add specific hashtags
          if (specificTags.length > 0) {
              allHashtags = allHashtags.concat(getSpecificHashtags(specificTags));
          }
          
          // Add popular or niche hashtags based on audience size
          if (audienceSize === 'small') {
              allHashtags = allHashtags.concat(nicheTags.slice(0, 5));
              // Add more specific hashtags for small audiences
              allHashtags.push(`#${mainTopic}community`);
              allHashtags.push(`#support${mainTopic}`);
          } else if (audienceSize === 'large') {
              allHashtags = allHashtags.concat(popularHashtags.slice(0, 5));
          } else {
              // For medium, mix both
              allHashtags = allHashtags.concat(popularHashtags.slice(0, 3));
              allHashtags = allHashtags.concat(nicheTags.slice(0, 2));
          }
          
          // Filter out duplicates and limit to 30 (Instagram's limit)
          allHashtags = [...new Set(allHashtags)].slice(0, 30);
          
          // Shuffle the array for variety
          allHashtags = allHashtags.sort(() => 0.5 - Math.random());
          
          // Create hashtag sets (5-6 groups of 5-6 hashtags each)
          generatedHashtags = [];
          
          // Set 1: Most popular mix
          generatedHashtags.push(allHashtags.slice(0, 6).join(' '));
          
          // Set 2: Topic-focused
          const topicFocused = [`#${mainTopic}`];
          specificTags.forEach(tag => topicFocused.push(`#${tag.trim()}`));
          while (topicFocused.length < 6) {
              const randomIndex = Math.floor(Math.random() * allHashtags.length);
              topicFocused.push(allHashtags[randomIndex]);
          }
          generatedHashtags.push([...new Set(topicFocused)].join(' '));
          
          // Set 3: Balanced mix
          const balancedSet = [];
          // Add some popular ones
          balancedSet.push(popularHashtags[0]);
          balancedSet.push(popularHashtags[1]);
          // Add some niche ones
          balancedSet.push(nicheTags[0]);
          balancedSet.push(nicheTags[1]);
          // Add some topic-specific ones
          balancedSet.push(`#${mainTopic}`);
          if (specificTags.length > 0) {
              balancedSet.push(`#${specificTags[0]}`);
          }
          generatedHashtags.push([...new Set(balancedSet)].join(' '));
          
          // Set 4: More specific to the content
          const extractedWords = description
              .toLowerCase()
              .replace(/[^\w\s]/gi, '')
              .split(' ')
              .filter(word => word.length > 3)
              .slice(0, 3);
              
          const contentSpecific = [`#${mainTopic}`];
          extractedWords.forEach(word => contentSpecific.push(`#${word}`));
          while (contentSpecific.length < 6) {
              const randomIndex = Math.floor(Math.random() * allHashtags.length);
              contentSpecific.push(allHashtags[randomIndex]);
          }
          generatedHashtags.push([...new Set(contentSpecific)].join(' '));
          
          // Set 5: Complete random selection from the pool
          const randomSelection = [];
          for (let i = 0; i < 6; i++) {
              const randomIndex = Math.floor(Math.random() * allHashtags.length);
              randomSelection.push(allHashtags[randomIndex]);
          }
          generatedHashtags.push([...new Set(randomSelection)].join(' '));
  
          debug('Generated hashtag sets: ' + generatedHashtags.length);
  
          // Simulate processing time
          setTimeout(() => {
              // Create hashtag cards
              generatedHashtags.forEach((hashtagSet, index) => {
                  const hashtagCard = document.createElement('div');
                  hashtagCard.className = 'hashtag-card';
                  
                  // Generate popularity tags
                  const popularityClass = index === 0 ? 'popular' : (index === 1 || index === 2 ? 'medium' : 'niche');
                  const popularityLabel = index === 0 ? 'Popular' : (index === 1 || index === 2 ? 'Medium' : 'Niche');
                  
                  hashtagCard.innerHTML = `
                      <div class="hashtag-text">
                          <span class="hashtag-popularity ${popularityClass}">${popularityLabel}</span>
                          ${hashtagSet}
                          <span class="hashtag-count">${hashtagSet.split(' ').length} hashtags</span>
                      </div>
                      <button class="copy-btn" data-hashtags="${hashtagSet}">Copy</button>
                  `;
                  hashtagsList.appendChild(hashtagCard);
              });
  
              // Show results and hide loading
              resultContainer.style.display = 'block';
              csvActions.style.display = 'block';
              loading.style.display = 'none';
              resultContainer.scrollIntoView({ behavior: 'smooth' });
          }, 800);
      } catch (err) {
          debug('Error generating hashtags: ' + err.message);
          alert('An error occurred while generating hashtags. Please try again.');
          loading.style.display = 'none';
      }
  }
  
  // Copy text to clipboard
  function copyToClipboard(text, button) {
    debug('Copying to clipboard: ' + text);
    
    try {
        // Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => button.textContent = 'Copy', 2000);
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            button.textContent = 'Copied!';
            setTimeout(() => button.textContent = 'Copy', 2000);
        }
    } catch (err) {
        debug('Copy failed: ' + err.message);
        alert('Failed to copy. Please copy manually.');
    }
  }
  
  // Convert hashtags to CSV
  function convertToCSV() {
    debug('Converting to CSV');
    
    if (!generatedHashtags.length) {
        alert('No hashtags to convert. Please generate hashtags first.');
        return;
    }
  
    try {
        let csvContent = 'Instagram Hashtags\n';
        generatedHashtags.forEach((hashtagSet, index) => {
            const setType = index === 0 ? 'Popular Mix' : (index === 1 ? 'Topic-Focused' : (index === 2 ? 'Balanced Mix' : (index === 3 ? 'Content-Specific' : 'Random Selection')));
            const escapedHashtags = `"${hashtagSet.replace(/"/g, '""')}"`;
            csvContent += `${setType},${escapedHashtags}\n`;
        });
  
        debug('CSV content created');
        
        // Create blob and URL
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        
        // Store URL for download button
        csvData = url;
        
        // Show download button
        downloadBtn.href = url;
        downloadBtn.setAttribute('download', 'instagram_hashtags.csv');
        downloadBtn.style.display = 'inline-block';
        
        csvBtn.textContent = 'CSV Created!';
        setTimeout(() => csvBtn.textContent = 'Convert to CSV File', 2000);
    } catch (err) {
        debug('CSV conversion failed: ' + err.message);
        alert('Failed to create CSV. Please try again.');
    }
  }
  
  // Download the CSV file
  function downloadCSV() {
    debug('Downloading CSV');
    
    if (!csvData) {
        alert('Please convert to CSV first.');
        return;
    }
    
    try {
        downloadBtn.textContent = 'Downloading...';
        setTimeout(() => downloadBtn.textContent = 'Download CSV', 2000);
    } catch (err) {
        debug('CSV download failed: ' + err.message);
        alert('Failed to download CSV. Please try again.');
    }
  }
  
  // Bind events with try-catch for safety
  try {
    debug('Setting up event listeners');
    
    // Generate button click
    generateBtn.addEventListener('click', function(e) {
        debug('Generate button clicked via addEventListener');
        e.preventDefault();
        generateHashtags();
    });
  
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        generateHashtags();
    });
  
    // Copy button clicks (using delegation)
    hashtagsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            const hashtags = e.target.getAttribute('data-hashtags');
            copyToClipboard(hashtags, e.target);
        }
    });
  
    // CSV button click
    csvBtn.addEventListener('click', convertToCSV);
    
    // Download button click
    downloadBtn.addEventListener('click', downloadCSV);
    
    debug('Event listeners set up successfully');
  } catch (err) {
    debug('Error setting up event listeners: ' + err.message);
    alert('There was a problem setting up the application. Please refresh the page.');
  }
  
  // Run a quick test to ensure JS is properly running
  debug('Initilization complete');