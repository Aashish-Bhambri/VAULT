import React from 'react'
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { BsSquareFill } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { setOrdering, setPlatform } from '../app/features/gameSlice';
import { setGroup, setSingle } from '../app/features/displayOptionSlice';


const Filter = () => {
    const dispatch = useDispatch();
    const platform = useSelector(state => state.games.selectedPlatform);
    const order = useSelector(state => state.games.ordering);

    const group = useSelector(state => state.display.isGroup);
    const single = useSelector(state => state.display.isSingle);

    const handleSelectPlatform = (e) => {
        const val = e.target.value;
        dispatch(setPlatform(val || null));
    };
    const handleOrdering = (e) => {
        const val = e.target.value;
        dispatch(setOrdering(val));
    };
    const handleGroup = () => {
        dispatch(setGroup());
    };
    const handleSingle = () => {
        dispatch(setSingle());
    };

    return (
        <div className='flex justify-between p-2 py-5 items-center '>
            <div className='flex gap-4'>
                <div className='bg-[hsla(0,0%,100%,.16)] rounded-xl p-2 px-4 font-bold transition-all '>
                    <label className='mr-2'>Order by:</label>
                    <select
                        value={order || ''}
                        className='outline-0 cursor-pointer bg-transparent text-white'
                        onChange={handleOrdering}
                    >
                        <option value="" className="text-black">Relevance</option>
                        <option value="-added" className="text-black">Popularity</option>
                        <option value="name" className="text-black">Name</option>
                        <option value="-released" className="text-black">Release date</option>
                        <option value="-metacritic" className="text-black">Metacritic</option>
                        <option value="-rating" className="text-black">Average rating</option>
                        <option value="-created" className="text-black">Date added</option>
                    </select>
                </div>
                <div className='bg-[hsla(0,0%,100%,.16)] rounded-xl p-2 px-4 font-bold '>
                    <select
                        value={platform || ''}
                        className='outline-0 cursor-pointer bg-transparent text-white'
                        onChange={handleSelectPlatform}
                    >
                        <option value="" className="text-black">All Platforms</option>
                        <option value="1" className="text-black">PC</option>
                        <option value="2" className="text-black">PlayStation</option>
                        <option value="3" className="text-black">Xbox</option>
                        <option value="4" className="text-black">iOS</option>
                        <option value="8" className="text-black">Android</option>
                        <option value="5" className="text-black">Apple Macintosh</option>
                        <option value="6" className="text-black">Linux</option>
                        <option value="7" className="text-black">Nintendo</option>
                    </select>
                </div>
            </div>
            <div className='flex gap-3 cursor-pointer'>
                <BsFillGrid3X3GapFill onClick={handleGroup} size={35} />
                <div><BsSquareFill onClick={handleSingle} size={35} /></div>
            </div>
        </div>
    );
};

export default Filter