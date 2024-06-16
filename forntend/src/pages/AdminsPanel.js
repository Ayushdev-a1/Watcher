import React, { useState } from 'react';
import './AdminPannel.css';
import { IoMdSearch } from 'react-icons/io';
import { MdOutlineContactSupport } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';

export default function AdminsPanel() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const selectItem = (index) => {
        setSelectedItemIndex(index === selectedItemIndex ? -1 : index);
    };

    return (
        <>
            <div className="AdminPannel">
                <nav>
                    <ul>
                        <div className="websecction">
                            <li>Logo</li>
                            <li>Username</li>
                            <li>select</li>
                        </div>
                        <li className="searchBar">
                            <IoMdSearch />
                            <input type="text" placeholder="Search PageRoll...." />
                        </li>
                        <div className="supportsection">
                            <li>news</li>
                            <li>
                                <MdOutlineContactSupport />
                                Support
                            </li>
                            <li>
                                <CgProfile />
                            </li>
                        </div>
                    </ul>
                </nav>
                <div className={`Sidenav ${isExpanded ? 'ExpandedSidenav' : ''}`}>
                    <span className={`${isExpanded ? 'rotate' : 'expand'}`} onClick={toggleSidebar}>
                        <div className="line0"></div>
                        <div className="line1"></div>
                    </span>
                    <ul className="list">
                        <li className={selectedItemIndex === 0 ? 'selected' : ''} onClick={() => selectItem(0)}>Site Overview</li>
                        <li className={selectedItemIndex === 1 ? 'selected' : ''} onClick={() => selectItem(1)}> Deploys</li>
                        <li className={selectedItemIndex === 2 ? 'selected' : ''} onClick={() => selectItem(2)}>Site Configuration</li>
                        <li className={selectedItemIndex === 3 ? 'selected' : ''} onClick={() => selectItem(3)}>Logs</li>
                        <li className={selectedItemIndex === 4 ? 'selected' : ''} onClick={() => selectItem(4)}>Integration</li>
                        <li className={selectedItemIndex === 5 ? 'selected' : ''} onClick={() => selectItem(5)}>Metrics</li>
                        <li className={selectedItemIndex === 6 ? 'selected' : ''} onClick={() => selectItem(6)}>Domain Manegment</li>
                        <li className={selectedItemIndex === 7 ? 'selected' : ''} onClick={() => selectItem(7)}>Forms</li>
                        <li className={selectedItemIndex === 8 ? 'selected' : ''} onClick={() => selectItem(8)}>Blobs</li>
                    </ul>
                    <button className='logBtn'>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
