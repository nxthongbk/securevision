import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';

import EditBar from '../components/Diagram/BarDiagram/bar-diagram';
import Diagram from '../components/Diagram/diagram';
import PreviewImage from '../components/Diagram/components/PreviewImage/preview-image';
import { useGetAttributesMonitoring } from '../useDashboard';
import { useGetLatestTelemetrys } from '../../DevicePage/handleApi';
// import { SidebarSimple } from '@phosphor-icons/react';
// import { useTranslation } from 'react-i18next';

interface ControlMonitoringProps {
  allDeviceInfos?: any;
  loadingP?: boolean;
  attributeProject?: any;
  projectName?: string;
  assetId?: string;
  showLiveStream?: boolean;
  handleShowLiveStream?: () => void;
  curCam?: any;
  typeProject?: string;
  listCam?: any[];
  dashboard: any;
  // isVisible: boolean;
  // setIsVisible: (visible: boolean) => void;
}

const ControlMonitoring: React.FC<ControlMonitoringProps> = ({ projectName, dashboard }) => {
  const { data, isLoading } = dashboard && useGetAttributesMonitoring(dashboard?.id);
  const [arrArea, setArrArea] = useState<any[]>([]);
  const [isShowDiagram, setShowDiagram] = useState(true);
  const [isMaximize, setMaximize] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const myDiagram = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(900);
  const [isDraw, setDraw] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [arrMachine, setArrMachine] = useState<any[]>([]);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [points, setPoints] = useState<number[]>([]);
  const [isPolyComplete, setPolyComplete] = useState(false);
  const [flattenedPoints, setFlattenedPoints] = useState<any>([]);
  const [selected, setSelected] = useState(false);
  const [telemetries, setTelemetries] = useState<any>();
  // const { t } = useTranslation();

  useEffect(() => {
    if (isDraw) return;
    setArrArea(data?.listArea);
    if (myDiagram.current) {
      const isCollapsed = JSON.parse(localStorage.getItem('collapsed') || 'false');
      setWidth(isCollapsed ? myDiagram.current.offsetWidth + 80 : myDiagram.current.offsetWidth - 80);
    }
  }, [myDiagram.current, dashboard, data]);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', updateWindowDimensions);
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  const devices = data?.listArea?.map((item) => item.key);
  const queries = useGetLatestTelemetrys({
    entityType: 'DEVICE',
    entityIds: devices
  });
  useEffect(() => {
    queries?.forEach((query) => {
      if (query.isLoading) {
        console.log('Loading...');
      } else if (query.isError) {
        console.error(query.error);
      } else if (query.data) {
        const data = query.data.data.data;
        const newData = { ...telemetries, ...data };
        // Only update state if newData is different from current telemetries
        if (JSON.stringify(newData) !== JSON.stringify(telemetries)) {
          setTelemetries(newData);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (myDiagram.current) {
      setWidth(myDiagram.current.offsetWidth);
      setHeight(myDiagram.current.offsetHeight);
      setMaximize(false);
      document.body.style.overflow = 'visible';
    }
  }, [isMaximize, size]);

  const extendCard = () => {
    setMaximize(!isMaximize);
    const card = document.getElementById('cardDiagram');
    if (card) {
      if (isMaximize) {
        document.body.style.overflow = 'visible';
        card.classList.remove('card-extend');
        localStorage.setItem('card-extend-diagram', 'false');
      } else {
        document.body.style.overflow = 'hidden';
        card.classList.add('card-extend');
        localStorage.setItem('card-extend-diagram', 'true');
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='flex flex-col w-full h-auto'>
      {/* removed this portion for cleaner UI - check w mr thong */}
      {/* <div className='flex '>
        <IconButton aria-label='close' onClick={() => setIsVisible && setIsVisible(!isVisible)}>
          <SidebarSimple size={20} />
        </IconButton> 
        <Typography variant='h4'>
          <span style={{ color: 'white' }}>{projectName}</span>
        </Typography>
      </div> */}
      <div className='w-[calc(95vw-240px)] flex-1'>
        <div className='m-4 border border-[var(--border-color)] rounded-lg bg-[var(--bg)]'>
          <div className='flex items-center justify-between px-4 border-b border-[var(--border-color)]'>
            <div>
              <Typography variant='label1' className='text-white'>
                {/* {t('diagram-area')} */}
                {projectName}
                {/* then we could replace area map with {projectName} */}
              </Typography>
            </div>
            <div className='flex justify-end p-2'>
              {data?.operationImage && isShowDiagram && (
                <EditBar
                  setDraw={setDraw}
                  setEdit={setEdit}
                  setPreview={setPreview}
                  setShowDiagram={setShowDiagram}
                  isEdit={isEdit}
                  isDraw={isDraw}
                  arrMachine={arrMachine}
                  setArrMachine={setArrMachine}
                  dataDiagram={data?.operationData}
                  arrArea={arrArea}
                  setArrArea={setArrArea}
                  width={width}
                  height={height}
                  isRole={true}
                  setPoints={setPoints}
                  setFlattenedPoints={setFlattenedPoints}
                  setPolyComplete={setPolyComplete}
                  selected={selected}
                  setSelected={setSelected}
                  dashboard={dashboard}
                  extendCard={extendCard}
                />
              )}
            </div>
          </div>

          <Grid container spacing={2}>
            <Grid item mobile={12}>
              {data?.operationImage && isShowDiagram ? (
                <div
                  className='card-diagram-alone flex justify-center items-center overflow-hidden relative w-full max-h-[80vh]'
                  ref={myDiagram}
                  id='myDiagram'
                  style={{
                    height: isMaximize ? '100%' : '80vh',
                    width: isMaximize ? '100%' : '100%',
                  }}
                >
                  <Diagram
                    ImageDiagram={data?.operationImage}
                    width={width}
                    height={height}
                    isDraw={isDraw}
                    isEdit={isEdit}
                    isDelete={isDelete}
                    setEdit={setEdit}
                    setDelete={setDelete}
                    setArrMachine={setArrMachine}
                    arrMachine={arrMachine}
                    dataDiagram={data?.operationData}
                    //poly
                    dataArea={data?.listArea}
                    points={points}
                    setPoints={setPoints}
                    isPolyComplete={isPolyComplete}
                    setPolyComplete={setPolyComplete}
                    flattenedPoints={flattenedPoints}
                    setFlattenedPoints={setFlattenedPoints}
                    arrArea={arrArea}
                    setArrArea={setArrArea}
                  />
                </div>
              ) : isLoading ? (
                <div className='flex items-center justify-center w-full h-[70vh]'>
                  <CircularProgress />
                </div>
              ) : (
                <PreviewImage
                  setShowDiagram={setShowDiagram}
                  dashboard={dashboard}
                  preview={preview}
                  setPreview={setPreview}
                />
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ControlMonitoring;
