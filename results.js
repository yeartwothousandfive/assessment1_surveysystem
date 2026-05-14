(function () {

  const params = new URLSearchParams(window.location.search);

  const container =
    document.getElementById('results-container');

  const typeLabel =
    document.getElementById('survey-type-label');

  const isBefore =
    params.has('name') || params.has('grade');

  const isAfter =
    params.has('visited_location') ||
    params.has('first_impression');

  function paramsToObject(params) {

    const obj = {};

    for (const key of params.keys()) {

      const values = params.getAll(key);

      obj[key] =
        values.length > 1
          ? values.join(', ')
          : values[0];
    }

    return obj;
  }

  // load submissions 

  const submissions =
    JSON.parse(
      localStorage.getItem('surveySubmissions')
    ) || [];

  typeLabel.textContent =
    'All Survey Results';

  // search bar

  const searchBox =
    document.createElement('input');

  searchBox.type = 'text';

  searchBox.placeholder =
    'Search student name...';

  searchBox.className =
    'search-input';

  container.appendChild(searchBox);


  // delete all
  
  const deleteBtn = document.getElementById('del');

  deleteBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete all survey data? This cannot be undone.')) {
    localStorage.removeItem('surveySubmissions');
    renderTables();
  }
  });


  // table

  const beforeFields = [
  'name',
  'grade',
  'age',
  'location',
  'companion',
  'excitement',
  'expectations',
  'prior_visit',
  'timestamp'
  ];

  const afterFields = [
  'name',
  'visited_location',
  'first_impression',
  'staff_rating',
  'pricing',
  'cleanliness',
  'crowd',
  'overall_rating',
  'met_expectations',
  'environment_safe',
  'skills_gained',
  'more_confident',
  'helpfulness',
  'recommend',
  'participate_again',
  'liked_most',
  'improvements',
  'additional_comments',
  'timestamp'
  ];

  const beforeLabels = {
    name:         'Name',
    grade:        'Grade',
    age:          'Age',
    location:     'Location',
    companion:    'Q1',
    excitement:   'Q2',
    expectations: 'Q3',
    prior_visit:  'Q4',
    timestamp:    'Timestamp'
  };

  const afterLabels = {
    name:                'Name',
    visited_location:    'Q1',
    first_impression:    'Q2',
    staff_rating:        'Q3',
    pricing:             'Q4',
    cleanliness:         'Q5',
    crowd:               'Q6',
    overall_rating:      'Q7',
    met_expectations:    'Q8',
    environment_safe:    'Q9',
    skills_gained:       'Q10',
    more_confident:      'Q11',
    helpfulness:         'Q12',
    recommend:           'Q13',
    participate_again:   'Q14',
    liked_most:          'Q15',
    improvements:        'Q16',
    additional_comments: 'Q17',
    timestamp:           'Timestamp'
  };

  function formatHeader(text) {

    return text
      .replaceAll('_', ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function createTable(title, fields, data, labels = {}) {

    const section =
      document.createElement('section');

    const heading =
      document.createElement('h2');

    heading.textContent = title;

    section.appendChild(heading);

    const table =
      document.createElement('table');

    table.className = 'result-table';

    const thead =
      document.createElement('thead');

    const headRow =
      document.createElement('tr');

    fields.forEach(field => {

      const th =
        document.createElement('th');

      th.textContent =
        labels[field] || formatHeader(field);

      headRow.appendChild(th);
    });

    thead.appendChild(headRow);

    table.appendChild(thead);

    const tbody =
      document.createElement('tbody');

    data.forEach(submission => {

      const row =
        document.createElement('tr');

      fields.forEach(field => {

        const td =
          document.createElement('td');

        td.textContent =
          submission.answers[field] ||
          submission[field] ||
          '—';

        row.appendChild(td);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    section.appendChild(table);

    return section;
  }

  function renderTables(filter = '') {

    const oldSections =
      document.querySelectorAll(
        '.generated-table'
      );

    oldSections.forEach(sec => sec.remove());

    const beforeData =
      submissions.filter(sub => {

        const name =
          (sub.answers.name || '').toLowerCase();

        return sub.type === 'before' &&
          name.includes(
            filter.toLowerCase()
          );
      });

    const afterData =
      submissions.filter(sub => {

        const name =
          (sub.answers.name || '').toLowerCase();

        return sub.type === 'after' &&
          name.includes(
            filter.toLowerCase()
          );
      });

    const beforeSection =
      createTable('Before Survey Results', beforeFields, beforeData, beforeLabels);

    beforeSection.classList.add(
      'generated-table'
    );

    container.appendChild(beforeSection);

    const afterSection =
      createTable('After Survey Results', afterFields, afterData, afterLabels);

    afterSection.classList.add(
      'generated-table'
    );

    container.appendChild(afterSection);
  }

  searchBox.addEventListener(
    'input',
    () => {

      renderTables(
        searchBox.value
      );
    }
  );

  function removeDuplicates() {
  const stored = JSON.parse(localStorage.getItem('surveySubmissions')) || [];

  const seen = new Set();
  const cleaned = stored.filter((sub, index) => {
    const name     = (sub.answers?.name     || '').trim().toLowerCase();
    const section  = (sub.answers?.grade    || '').trim().toLowerCase();
    const location = (sub.answers?.location || '').trim().toLowerCase();

    const key = `${sub.type}|${name}|${section}|${location}`;

    if (seen.has(key)) {
      console.log(`Duplicate removed at index ${index}:`, sub.answers?.name);
      return false; 
    }

    seen.add(key); 
    return true;
  });

  localStorage.setItem('surveySubmissions', JSON.stringify(cleaned));
  }

  removeDuplicates(); 
  renderTables();

})();