//import React, { useState } from 'react';
import BlogCard from './components/blogcard';

//import React, { useState } from 'react';



function App() {

  //const [aosState, setAosState] = useState("flip-left");

  return (
    <div className="flex bg-black justify-center items-center w-full">
      <div className="flex flex-col items-center align-items:center w-7/12 justify-content:center">
        <h1 className="text-4xl pt-5 text-white">hi this is the heading</h1>
        <BlogCard 
          title="Blog Post 1" 
          description="This is a description for the first blog post." 
        />
        <BlogCard 
          title="Blog Post 2" 
          description="This is a description for the second blog post." 
        />
        <BlogCard 
          title="Blog Post 3" 
          description="This is a description for the third blog post." 
        />
        <BlogCard 
          title="Blog Post 4" 
          description="This is a description for the fourth blog post." 
        />
        <BlogCard 
          title="Blog Post 5" 
          description="This is a description for the fifth blog post." 
        />
        <BlogCard 
          title="Blog Post 5" 
          description="This is a description for the fifth blog post." 
        />
        <BlogCard 
          title="Blog Post 5" 
          description="This is a description for the fifth blog post." 
        />
        <BlogCard 
          title="Blog Post 5" 
          description="This is a description for the fifth blog post." 
        />
        <BlogCard 
          title="Blog Post 5" 
          description="This is a description for the fifth blog post." 
        />
        <BlogCard 
          title="Blog Post 5" 
          description="This is a description for the fifth blog post." 
        />
      </div>
    </div>
  );
}

export default App;
