import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import GraphBlock from './graph-block.component';
import { Copy, DotsSix, DotsThreeOutlineVertical, TrashSimple } from '@phosphor-icons/react';
import { Menu, MenuItem, Typography } from '@mui/material';
import PopupCoverDelete from '~/components/Modal/DeletePopup';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridLayoutProps {
  data?: any;
  layouts?: any;
  setBreakPoint?: (breakpoint: string) => void;
  isEdit?: boolean;
  updateLayout?: (layout: any) => void;
  dashboardId?: string;
  updatePageWidget?: (widgets: any) => void;
}

const GridLayout: React.FC<GridLayoutProps> = ({ updatePageWidget, updateLayout, data, isEdit = false }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const today = new Date();
  const [timeTitle, setTimeTitle] = useState(`
  ${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}
${today.getHours()}:${today.getMinutes()}
  `);
  const [widgetId, setWidgetId] = useState(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setWidgetId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveWidget = () => {
    setIsPending(true);
    const newWidgets = data?.filter((item) => item.widgetId !== widgetId);
    updateLayout(newWidgets);
    setIsSuccess(true);
    setIsPending(false);
  };
  const copyWidget = () => {
    setAnchorEl(null);
    const newWidgets = data?.filter((item) => item.widgetId === widgetId);
    if (newWidgets && newWidgets.length > 0) {
      const copiedWidget = { ...newWidgets[0], widgetId: data.length + 1, title: newWidgets[0].title + ' - Copy' };
      const updatedData = [...data, copiedWidget];
      updatePageWidget(updatedData);
    }
  };
  return (
    <ResponsiveGridLayout
      className='p-4 layout w-100'
      isDraggable={isEdit}
      isRearrangeable={isEdit}
      isResizable={isEdit}
      draggableHandle='.grid-item__move'
      breakpoints={{ lg: 1280, md: 992, sm: 767, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      onLayoutChange={(layout) => {
        const change = data?.map((element) => {
          const foundItem = layout.find((item) => parseInt(item.i) === element.widgetId);
          if (foundItem) {
            element.dataGrid = {
              x: foundItem?.x || 0,
              y: foundItem?.y || 0,
              w: foundItem?.w || 0,
              h: foundItem?.h || 0
            };
            return element;
          }
        });
        change !== undefined && updateLayout(change);
      }}
    >
      {data &&
        data?.map((item) => {
          return (
            item && (
              <div key={item.widgetId} data-grid={{ ...item.dataGrid }} className={`grid-item `}>
                <div className={`relative flex justify-between ${item?.type !== 'title' && 'grid-item__title'}`}>
                  {item?.type !== 'title' ? (
                    <div>
                      {item?.title}
                      <div>
                        <Typography variant='caption'>{timeTitle}</Typography>
                      </div>
                    </div>
                  ) : <div></div>}

                  {isEdit && (
                    <div className='absolute top-0 flex items-start grid-item__move left-1/2 hover:cursor-move'>
                      <DotsSix size={32} />
                    </div>
                  )}
                  {isEdit && (
                    <div className='flex justify-end'>
                      <div className='cursor-pointer' onClick={(e) => handleClick(e, item.widgetId)}>
                        <DotsThreeOutlineVertical />
                      </div>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem className='gap-2 !text-sm' onClick={copyWidget}>
                          <Copy size={20} /> Nhân bản
                        </MenuItem>
                        <PopupCoverDelete
                          btnComponent={
                            <MenuItem className='gap-2 !text-sm'>
                              <TrashSimple size={20} /> Xoá
                            </MenuItem>
                          }
                          isSuccess={isSuccess}
                          handleSubmit={handleRemoveWidget}
                          title='remove-title-dashboard'
                          message='confirm-remove-dashboard'
                          isLoading={isPending}
                        />
                      </Menu>
                    </div>
                  )}
                </div>

                {
                  <div className='grid-item__graph'>
                    <GraphBlock setTimeTitle={setTimeTitle} type={item?.type} item={item} />
                  </div>
                }
              </div>
            )
          );
        })}
    </ResponsiveGridLayout>
  );
};

export default GridLayout;
