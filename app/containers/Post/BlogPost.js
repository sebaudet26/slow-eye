import React, { Component } from 'react';
import Butter from 'buttercms';
import { Helmet } from 'react-helmet';

const butter = Butter('72b889cc7433551aef87ead79fda9723d260694f');
const urlParams = new URLSearchParams(window.location.search);

butter.post.retrieve('example-post')
  .then((resp) => {
    console.log(resp.data);
  }).catch((resp) => {
    console.log(resp);
  });

class BlogPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  componentWillMount() {
    const slug = urlParams.get('slug');
    console.log(slug);

    butter.post.retrieve(slug).then((resp) => {
      this.setState({
        loaded: true,
        post: resp.data.data,
      });
    });
  }

  render() {
    if (this.state.loaded) {
      const post = this.state.post;

      return (
        <div>
          <Helmet>
            <title>{post.seo_title}</title>
            <meta name="description" content={post.meta_description} />
            <meta name="og:image" content={post.featured_image} />
          </Helmet>

          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
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

export default BlogPost;
