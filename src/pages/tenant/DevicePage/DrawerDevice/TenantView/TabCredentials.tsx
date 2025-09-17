import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import deviceService from '~/services/device.service'; // 👈 make sure path matches your project

type Data = {
  key: string;
  lable: string;
  value: string | JSX.Element;
};

export default function TabsInforDevice({ props }: { props: Record<string, any>; hasEdit: boolean }) {
  const [mqttData, setMqttData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (props?.id) {
      deviceService
        .getInforMQTT(props.id)
        .then((res) => {
          console.log("MQTT response:", res.data); // 👈 full API return
          setMqttData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching MQTT info:", err);
        });
    }
  }, [props?.id]);

  // build rows dynamically from mqttData
  const mqttRows: Data[] = mqttData
    ? Object.entries(mqttData).map(([key, value]) => ({
        key,
        lable: key,
        value: String(value),
      }))
    : [];

  const data: Data[] = [
    { key: 'token', lable: 'Token', value: props?.token || '---' },
    ...mqttRows, // append MQTT rows after token
  ];

  return (
    <div className='w-full flex flex-col justify-start'>
      {data?.map((item: Data, idx: number) => {
        const bgColor = idx % 2 === 0 ? '#031f2f' : '#031523';

        return (
          <div
            key={idx}
            className='w-full flex justify-start items-start py-3 px-4 border'
            style={{ backgroundColor: bgColor, borderColor: 'var(--border)' }}
          >
            <div className='w-[30%]'>
              <Typography variant='label2' color='var(--text-primary)'>
                {item.lable}
              </Typography>
            </div>
            <div className='w-[70%] flex justify-start items-center'>
              <Typography variant='body2' color='var(--text-primary)'>
                {item.value}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
}
