function ajax() {

    const parent = document.querySelector('.blog-grid .js-items');

    if ( parent ) {

        const createDateFormat = date => new Date(date).toLocaleDateString("pl-PL", {
            year: 'numeric', month: 'long', day: 'numeric'
        })

        const createBlogElement = (link, title, date, image, categories) => {

            const categoriesString = categories.map(category => `<a href="${category.link}" rel="tag">${category.name}</a> | `)
                                               .join('')
                                               .slice(0, -2);

            const template = `<a href="${link}" class="img-wrap">
                            <img width="1024" height="657" src="${image}" class="attachment-large size-large wp-post-image">
                        </a>
                        <div class="category-list">${categoriesString}</div>
                        <a href="${link}" class="title-link">
                            <h3 class="post-title">${title}</h3>
                        </a>
                        <div class="date">${createDateFormat(date)}</div>`;


            const article = document.createElement("article")
            article.classList.add("item")
            article.innerHTML = template

            parent.appendChild(article)
        }

        const getPosts = async (options) => {

            const page = options.page,
                post_type = options.post_type,
                taxonomy = options.taxonomy || false,
                term_id = options.term_id || false,
                per_page = options.per_page,
                home_url = options.home_url

            let url = `${home_url}/wp-json/wp/v2/${post_type}?per_page=${per_page}&page=${page}&_embed`
            if ( taxonomy ) {
                url += `&${taxonomy}=${term_id}`
            }

            const response = await fetch(url);
            const posts = await response.json();

            posts.forEach(post => {
                createBlogElement(post.link, post.title.rendered, post.date, post._embedded[ 'wp:featuredmedia' ][ '0' ].media_details.sizes.large.source_url, post._embedded[ 'wp:term' ][ '0' ]);
            })

        }

        const fetchButton = document.querySelector('.fetchMoreProducts ')

        if ( fetchButton ) {

            fetchButton.addEventListener('click', async e => {
                e.target.parentNode.classList.add('animation');
                e.target.setAttribute('data-offset', parseInt(e.target.getAttribute('data-offset')) + 1)

                await getPosts({
                    page: e.target.getAttribute('data-offset'),
                    post_type: e.target.getAttribute('data-post-type'),
                    taxonomy: e.target.getAttribute('data-taxonomy') || false,
                    term_id: e.target.getAttribute('data-term-id'),
                    per_page: e.target.getAttribute('data-perpage'),
                    home_url: e.target.getAttribute('data-home')
                })

                e.target.parentNode.classList.remove('animation');

                if ( e.target.getAttribute('data-offset') * e.target.getAttribute('data-perpage') >= e.target.getAttribute('data-max') ) {
                    e.target.parentNode.style.display = 'none';
                }

            })
        }
    }


}

export default function () {
    ajax()
}