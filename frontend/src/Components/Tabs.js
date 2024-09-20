import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useState } from 'react';
import "../css/Tabs.css"

const Tabss = () => {
    const [tabs, setTabs] = useState([{ title: 'New Search', content: 'Any Content' }]);

    
    const addNewTab = () => {
        const newTabIndex = tabs.length + 1;
        const newTab = { title: `Search ${newTabIndex}`, content: `Any content ${newTabIndex}` };
        setTabs([...tabs, newTab]);
    };

    return (
        <div className="Tabs">
            <Tabs>
                <TabList>
                 
                    {tabs.map((tab, index) => (
                        <Tab key={index}>{tab.title}</Tab>
                    ))}

                
                    <button className="add-tab-button" onClick={addNewTab}>+</button>
                </TabList>

             
                {tabs.map((tab, index) => (
                    <TabPanel key={index}>
                        <h2>{tab.content}</h2>
                    </TabPanel>
                ))}
            </Tabs>
        </div>
    );
};

export default Tabss;
