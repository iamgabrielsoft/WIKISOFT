
const searchResults = document.querySelector('.search-result');
const form = document.querySelector('.js-search-form');
const spinner = document.querySelector('.js-spinner');
const empty_field = document.querySelector('.empty-field'); 
const reload =  document.querySelector('.reload'); 



const handleRequest = async (event) => {
  event.preventDefault();
  const inputValue = document.querySelector('.search-input').value;
  const searchQuery = inputValue.trim();
  searchResults.innerHTML = '';
  spinner.classList.remove('hidden');
  
  const results = await wikiSearch(searchQuery);

  try {

    if(results.query.search.totalhits === 0){
      console.log('NO RESULT FOUND')
    }

    return displayResults(results);

  } catch (err) {

      const empty = empty_field.innerHTML = 'Empty Field'
      empty_field.classList.add('animated', 'shake', 'alert');
      setTimeout(() => {
      empty_field.classList.replace(empty, empty_field.innerHTML = ' ')
      }, 1000)
      
  } finally {
    spinner.classList.add('hidden');
  }
}



const wikiSearch = async (searchQuery) => {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    console.log('Disconnected')

    if(reload.click()){
      location.reload()
    }

  }else {
    console.log('Connected')
    const json = await response.json();
    console.log(json)
    return json;
  }
  
}

const displayResults = async (results) => {
  results.query.search.map(resultId => {
    const url = `https://en.wikipedia.org/?curid=${resultId.pageid}`;
    searchResults.insertAdjacentHTML('beforeend',
      `<div class="result-item">
        <h3 class="result-title">
          <a href="${url}" target="_blank" rel="noopener">${resultId.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${resultId.snippet}</span><br>
      </div>`
    );
  });
}


form.addEventListener('submit', handleRequest);