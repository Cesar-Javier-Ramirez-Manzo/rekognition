import React, { Component  } from 'react';



class Image extends Component{


  render() {

    return(
      
      <img id='selectedImage' src={this.props.src} />
    )
  }
}

export default Image;