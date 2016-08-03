(() => {
  linkjuice.init('.single__content', {
    selectors: ['h2', 'h4', 'h5', 'h3:not(.single__author-name)'],
    contentFn: node => `
      <a href="#${node.id}" class="linkjuice">
        <span class="linkjuice-icon">
          <i class="material-icons">&#xE157;</i>
        </span>
        ${node.innerHTML}
      </a>
    `
  });
  const topics = document.querySelector('.c-topics__items');
  const bindTopics = () => {
    const posts = document.querySelectorAll('.c-topics__list-items li');
    if (!(posts && posts.length)) {
      document.querySelector('.c-topics__list-none').style.display = 'inherit';
    }
  };
  if (topics) {
    bindTopics();
  }
})();
