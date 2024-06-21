import React, { useRef, useEffect, useState } from "react";
import './popularCategories.css';

const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Graphics & Design",
      subTitle: "305 Open Positions",
      imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ_bfanUjeuYJV963LWLRpazvTrHHXH6XN7w&s",
    },
    {
      id: 2,
      title: "Software Development",
      subTitle: "500 Open Positions",
      imageUrl:"https://geeks4learning.com/wp-content/uploads/2021/04/software-dev-australia.jpg",
    },
    {
      id: 3,
      title: "Investment Management",
      subTitle: "200 Open Positions",
      imageUrl:"https://superguy.com.au/wp-content/uploads/2023/07/Investments-For-Retirement.jpg"},
    {
      id: 4,
      title: "Textile",
      subTitle: "1000+ Open Postions",
      imageUrl:"https://img.freepik.com/photos-gratuite/collection-motifs-textiles-mode-dynamique-ia-generative-affichage_188544-9090.jpg?size=626&ext=jpg&ga=GA1.1.1908636980.1712102400&semt=sph",
    },
    {
      id: 5,
      title: "Account & Finance",
      subTitle: "150 Open Positions",
      imageUrl:"https://img.freepik.com/photos-gratuite/concept-gestion-analyse-comptabilite-entreprise-finance_53876-15817.jpg",
    },
    {
      id: 6,
      title: "E-commerce",
      subTitle: "867 Open Positions",
      imageUrl:"https://st.depositphotos.com/1001877/3814/i/450/depositphotos_38143799-stock-photo-e-commerce-shopping-cart-with.jpg",
    },
    {
      id: 7,
      title: "Video Animation",
      subTitle: "50 Open Positions",
      imageUrl:"https://www.videoinabox.be/app/uploads/2020/03/animated-video.png",
    },
    {
      id: 8,
      title: "Game Development",
      subTitle: "80 Open Positions",
      imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJNZxyMbnxN27zZlrMzbzD3eVlQbWXcB0cDw&s",
    },
  ];

  const scrollContainerRef = useRef(null);
  const [showButtons, setShowButtons] = useState({ left: false, right: false });

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowButtons({
        left: scrollLeft > 0,
        right: scrollLeft < scrollWidth - clientWidth,
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      checkScroll();
    };

    if (scrollContainerRef.current) {
      checkScroll(); 
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); 

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="cover">
      <div className="scroll-images" ref={scrollContainerRef} onScroll={checkScroll}>
        {categories.map((category) => (
          <div className="child" key={category.id} style={{ backgroundColor: 'white' }}>
            <img src={category.imageUrl} alt={category.title} />
            <div>
              <h5>{category.title}</h5>
              <p>{category.subTitle}</p>
            </div>
          </div>
        ))}
      </div>
      
      {showButtons.left && (
        <button className="left" onClick={scrollLeft}><strong>&#8249;&#8249;</strong></button>
      )}
    
      {showButtons.right && (
        <button className="right" onClick={scrollRight}><strong>&#8250;&#8250;</strong></button>
      )}
    </div>
  );
};

export default PopularCategories;
