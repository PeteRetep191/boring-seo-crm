import React from 'react';
// Utils
import { getFlagImg } from '@/shared/lib/flag';

const FlagImg: React.FC<{ flag: string }> = ({ flag }) => {
    return(
        <div className='h-5 w-5 rounded-full overflow-hidden'>
            <img src={getFlagImg(flag, {})} alt={flag} className="object-cover h-full w-full" />
        </div>
    )
}

export default FlagImg;