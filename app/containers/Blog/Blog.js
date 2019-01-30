import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Butter from 'buttercms';

const butter = Butter('72b889cc7433551aef87ead79fda9723d260694f');

butter.post.list({ page: 1, page_size: 10 }).then((response) => {
  console.log(response);
});

class BlogHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  fetchPosts(page) {
    butter.post.list({ page: 1, page_size: 10 }).then((resp) => {
      this.setState({
        loaded: true,
        resp: resp.data,
      });
    });
  }

  componentWillMount() {
    const page = 1;

    this.fetchPosts(page);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loaded: false });

    const page = 1;

    this.fetchPosts(page);
  }

  render() {
    if (this.state.loaded) {
      const { next_page, previous_page } = this.state.resp.meta;

      return (
        <div>
          {this.state.resp.data.map(post => (
            <div key={post.slug}>
              <Link to={`/post?slug=${post.slug}`}>
                {post.title}
              </Link>
            </div>
          ))}

          <br />

          <div>
            {previous_page && <Link to={`/p/${previous_page}`}>Prev</Link>}

            {next_page && <Link to={`/p/${next_page}`}>Next</Link>}
          </div>
        </div>
      );
    }
    return (
      <div>
          Loading...
      </div>
    );
  }
}

export default BlogHome;
