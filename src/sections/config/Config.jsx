import React, { useState, useRef, useEffect } from 'react';
import Auth from '../../components/serviceworker/Auth';
import ApiUpdate from '../../components/serviceworker/ApiUpdate';
import FunctionEditor from '../functions/FunctionEditor';
import data from '../../init/project.json';
import './config.css';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";



import * as FaIcons from 'react-icons/fa';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Config = ({deployedTemplates,functionOptions,setFunctionOptions}) => { 
  const [layouts, setLayouts] = useState(null);
  const [widgetArray, setWidgetArray] = useState(
    () => {
      if (typeof localStorage.layout !== "undefined") {
        return JSON.parse(localStorage.layout);

      } else {
        return [];
      }

    });


  const [width, setWidth] = useState(400); // Set the initial width of the parent div
  const [height, setHeight] = useState(400); // Set the initial height of the parent div
  const childRefs = useRef([]);

  useEffect(() => {
    // Call the handleResize function when the component mounts to update the child components
    handleResize();
  }, []);

  const handleResize = () => {
    console.log('resizing');
    // Loop through the childRefs and update the position and angle of each child component
    childRefs.current.forEach((childRef, index) => {
      const angle = (index / childRefs.current.length) * 360;
      const radius = Math.min(width, height) * 0.4;
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      childRef.style.transform = `translate(${x}px, ${y}px) rotate(${angle - 90}deg)`;
    });
    console.log(childRefs.style);
    saveLayout();
  };


  const handleModify = (layouts, layout) => {
    const tempArray = widgetArray;
    setLayouts(layout);
    layouts?.map((position) => {
      tempArray[Number(position.i)].x = position.x;
      tempArray[Number(position.i)].y = position.y;
      tempArray[Number(position.i)].w = position.w;
      tempArray[Number(position.i)].h = position.h;
    });
    setWidgetArray(tempArray);
    saveLayout();
  };

  const handleAdd = (type, w, h, r) => {
    var count = widgetArray.length + 1
    while(widgetArray.some(item => item.i === type + count)){ count ++; }
    setWidgetArray([
      ...widgetArray,
      { i: type + count, x: 0, y: 0, w: w, h: h, t: type, r: r },
    ]);
  };

  const saveLayout = () => {
    console.log(widgetArray);
    localStorage.layout = JSON.stringify(widgetArray);
  };
  const applyresize= ()=>{
    setWidgetArray();
  }
  var updatedArray =[];
  const handleDelete = (key) => {
  
    setWidgetArray(prevArray => {
       updatedArray = prevArray.filter(widget => widget.i !== key);
      // Adjust the grid positions and sizes of the remaining widgets
      const remainingWidgets = updatedArray.map((widget, index) => {
        return { ...widget, x: index % 8, y: Math.floor(index / 8)};
      });
      
      saveLayout();
      return remainingWidgets;
    });
  };
  
  

  return (
    <div class="integration">
      
        <div class="button-top">
    
        <button onClick={() => handleAdd("auth", 6, 2, true)}><sub> Auth</sub> <br /> <br /> <FaIcons.FaMoneyBillAlt /> </button>
        <button onClick={() => handleAdd("fx", 3, 2, true)}><sub>  Function </sub><br /><br /> <FaIcons.FaMap /></button>
        <button onClick={() => handleAdd("sw", 3, 2, true)}><sub> External Services </sub><br /><br /> <FaIcons.FaCube /></button>
    
        </div>
      <ResponsiveReactGridLayout
        onLayoutChange={handleModify}
        verticalCompact={true}
        layout={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        preventCollision={false}
        cols={{ lg: 8, md: 8, sm: 4, xs: 2, xxs: 2 }}
        autoSize={true}
        margin={{
          lg: [20, 20],
          md: [20, 20],
          sm: [20, 20],
          xs: [20, 20],
          xxs: [20, 20],
        }}
      >
        {widgetArray?.map((widget, index) => {
          let component;
          switch (widget.t) {
            case 'auth':
              component = <Auth serviceWorkers={data}/> ;
              break;
            case 'fx':
              component = <FunctionEditor functionOptions={functionOptions} setFunctionOptions={setFunctionOptions} serviceWorkers={deployedTemplates}/>;
              break;
            case 'sw':
              component = <ApiUpdate serviceWorkers={deployedTemplates}/>;
              break;
   
           
            default:
              component = '<div />';
          }
          console.log(widget?.r);
          return (
            <div
              className="reactGridItem"
              key={index}
              data-grid={{
                x: widget?.x,
                y: widget?.y,
                w: widget?.w,
                h: widget?.h,
                i: widget.i,
                minW: 2,
                maxW: Infinity,
                minH: 2,
                maxH: Infinity,
                isDraggable: true,
                isResizable: widget?.r,
              }}
            >
              <button
                className="deleteButton"
                onClick={() => handleDelete(widget.i)}
              >
                x
              </button>

              {component}
            </div>
          );
        })}
      </ResponsiveReactGridLayout>
    </div>
  );
};


export default Config;
