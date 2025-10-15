import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';

import EditBar from '../components/Diagram/BarDiagram/bar-diagram';
import Diagram from '../components/Diagram/diagram';
import PreviewImage from '../components/Diagram/components/PreviewImage/preview-image';
import BabylonViewer from '../components/Babylon/babylon-scene';
import { useGetAttributesMonitoring } from '../useDashboard';
import { useGetLatestTelemetrys } from '../../DevicePage/handleApi';
import { dashboardService } from '~/services/dashboard.service';
interface ControlMonitoringProps {
  projectName?: string;
  dashboard: any;
}

// const TEST  = "/assets/3d_model.glb";
// const TEST_2 = "https://scity-dev.innovation.com.vn/api/storage/files/noauth/model/6b999338-f817-4024-aeb5-7dbfdbf102d0_a1863d0b.glb"
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
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  // Update area when data changes
  useEffect(() => {
    if (isDraw) return;
    setArrArea(data?.listArea);
    if (myDiagram.current) {
      const isCollapsed = JSON.parse(localStorage.getItem('collapsed') || 'false');
      setWidth(isCollapsed ? myDiagram.current.offsetWidth + 80 : myDiagram.current.offsetWidth - 80);
    }
  }, [myDiagram.current, dashboard, data]);

  // Window resize listener
  useEffect(() => {
    const updateWindowDimensions = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', updateWindowDimensions);
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  // Fetch telemetry data
  const devices = data?.listArea?.map((item) => item.key);
  const queries = useGetLatestTelemetrys({ entityType: 'DEVICE', entityIds: devices });
  useEffect(() => {
    queries?.forEach((query) => {
      if (query.isLoading) return;
      if (query.isError) console.error(query.error);
      if (query.data) {
        const newData = { ...telemetries, ...query.data.data.data };
        if (JSON.stringify(newData) !== JSON.stringify(telemetries)) {
          setTelemetries(newData);
        }
      }
    });
  }, [queries, telemetries]);

  // Adjust diagram size
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

  // Window resize for engine
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Construct model URL if available
  // const modelUrl = data?.operationModel
  //   ? `https://scity-dev.innovation.com.vn/api/storage/files/${data.operationModel}`
  //   : null;

  // Fetch Babylon model if operationModel exists
  // useEffect(() => {
  //   if (data?.operationModel) {
  //     const fetchModel = async () => {
  //       try {
  //         const url = await dashboardService.getBabylonModel(data.operationModel);
  //         setModelUrl(url);
  //       } catch (err) {
  //         console.error('❌ Failed to fetch Babylon model:', err);
  //       }
  //     };
  //     fetchModel();
  //   }
  // }, [data?.operationModel]);
useEffect(() => {

  if (data.operationImage) {

  // if (false) {
    setPreview(data.operationImage); // image takes priority
    setModelUrl(null);

  } else if (data?.operationModel) {
  //  } else if (true) {
    const fetchModel = async () => {
      try {
        const url = await dashboardService.getBabylonModel(data.operationModel);
        setModelUrl(url);
        // setModelUrl(TEST_2)
        setPreview(null);
      } catch (err) {
        console.error('❌ Failed to fetch Babylon model:', err);
      }
    };
    fetchModel();
  } else {
    setPreview(null);
    setModelUrl(null);
  }
}, [data?.operationImage, data?.operationModel]);



  return (
    <div className="flex flex-col w-full h-auto">
      <div className="w-[calc(95vw-240px)] flex-1">
        <div className="m-4 border border-[var(--border-color)] bg-[var(--bg)]">
          <div className="flex items-center justify-between px-4 border-b border-[var(--border-color)]">
            <Typography variant="label1" className="text-white">
              {projectName}
            </Typography>
            <div className="flex justify-end p-2">
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
  <div
    className="card-diagram-alone flex justify-center items-center overflow-hidden relative w-full max-h-[80vh]"
    ref={myDiagram}
    id="myDiagram"
    style={{ height: '75vh', width: '100%' }}
  >
    {modelUrl ? (
      <BabylonViewer
        width={width}
        height={height}
        editMode={isEdit || isDraw}
        modelUrl={modelUrl}
      />
    ) : data?.operationImage && isShowDiagram ? (
      <Diagram
        ImageDiagram={preview || data?.operationImage}
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
    ) : isLoading ? (
      <div className="flex items-center justify-center w-full h-[70vh]">
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
  </div>
</Grid>

          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ControlMonitoring;
