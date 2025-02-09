import React, { useState } from 'react';
import LocationModal from '@/components/common/Test';

const App = () => {
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setIsLocationModalOpen(true)}>Open Location Modal</button>
            <LocationModal
                IsLocationModalOpen={isLocationModalOpen}
                OnHide={() => setIsLocationModalOpen(false)}
            />
        </div>
    );
};

export default App;