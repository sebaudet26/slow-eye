import React from 'react';
import './style.scss';

class EmptyState extends React.Component {
  render() {
    const { isError } = this.props;
    return (
      <div className="emptyState">
        {
         isError ? (
           <div>
             <h2>Oops!</h2>
             <p>Someting went wrong here. Please try again.</p>
           </div>
         ) : (
           <div>
             <h3>No Games Scheduled.</h3>
           </div>
         )
        }
      </div>
    );
  }
}

export default EmptyState;
