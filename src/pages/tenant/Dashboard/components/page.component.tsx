import { useEffect, useState } from 'react';
import GridLayoutCustom from './grid-layout.component';
import { Check, PencilSimple, Plus, SidebarSimple, X } from '@phosphor-icons/react';
import { IconButton, Typography } from '@mui/material';
import EditableDiv from './editable-text.componet';
import ButtonCustom from '~/components/ButtonCustom';
import CreateWidget from './create-widget.component';
import { useGetAttributes } from '../useDashboard';
import { useMutation } from '@tanstack/react-query';
import { dashboardService } from '~/services/dashboard.service';
import { useTenantCode } from '~/utils/hooks/useTenantCode';

const PageComponent = ({ dashboard, toggleMenu }: any) => {
  const { tenantCode } = useTenantCode();
  const [isEdit, setIsEdit] = useState(false);
  const [pages, setPages] = useState<any>();
  const [activePage, setActivePage] = useState();
  const handlePageChange = (pageTitle) => {
    setActivePage(pageTitle);
  };
  const handleAddPage = () => {
    const newPage = {
      pageId: pages.length > 0 ? pages.length + 1 : 1,
      title: 'Trang mới',
      widgets: []
    };
    setPages([...pages, newPage]);
    setActivePage(newPage.pageId);
  };
  const handleRemovePage = () => {
    const newPages = pages.filter((page) => page.pageId !== activePage);
    setPages(newPages);
    setActivePage(newPages && newPages[0]?.pageId);
  };
  const { data } = useGetAttributes(dashboard?.id);
  useEffect(() => {
    setPages(data);
    data && setActivePage(data[0]?.pageId);
  }, [data]);

  const createPage = useMutation({
    mutationFn: (body: { data: any }) => {
      return dashboardService.createPage(tenantCode, dashboard?.id, body.data);
    }
  });

  const updatePageWidget = (pageId, widgets) => {
    const newPages = pages?.map((page) => {
      if (page.pageId === pageId) {
        const newWidget = [...page.widgets];
        newWidget.push({ widgetId: page.widgets.length > 0 ? Date.now() + page.widgets.length + 1 : 1, ...widgets });
        return {
          ...page,
          widgets: newWidget
        };
      }
      return page;
    });
    setPages(newPages);
  };
  const savePage = () => {
    createPage.mutate({ data: pages });
    setIsEdit(false);
  };
  const updateLayout = (pageId, widgets) => {
    const newPages = pages?.map((page) => {
      if (page.pageId === pageId) {
        // Update the layout for the matching page
        return {
          ...page,
          widgets
        };
      }
      return page;
    });
    setPages(newPages);
  };
  return (
    <div>
      <div className='flex gap-2 px-4'>
        <IconButton aria-label='close' onClick={() => toggleMenu && toggleMenu()}>
          <SidebarSimple size={20} />
        </IconButton>
        <div className='flex justify-between w-full'>
          <div className='bg-[var(--grey-primary-60)] w-fit px-1 pr-3 py-1 rounded-md flex gap-2'>
            {pages?.map((page) => (
              <div className='flex items-center' key={page.title} onClick={() => handlePageChange(page.pageId)}>
                <EditableDiv defaultValue={page.title} active={page.pageId === activePage} />
                {page.pageId !== activePage && isEdit && (
                  <X
                    onClick={() => handleRemovePage()}
                    size={12}
                    className='cursor-pointer text-[var(--text-primary)]'
                  />
                )}
              </div>
            ))}
            {isEdit && <div className='flex items-center pl-3 cursor-pointer' onClick={handleAddPage}>
              <Plus size={24} className='text-[var(--text-primary)]' />
            </div>}
          </div>
          <div>
            {isEdit ? (
              <div className='flex gap-2'>
                <CreateWidget
                  pageId={activePage}
                  handleSuccess={(e) =>
                    updatePageWidget(e.pageId, {
                      ...e,
                      dataGrid: { w: 4, h: e.type === 'title' ? 1 : 2.5, x: 8, y: 0 }
                    })
                  }
                />
                <ButtonCustom
                  variant='contained'
                  startIcon={<Check />}
                  onClick={() => savePage()}
                  className='!bg-[var(--primary)] !text-[var(--white)] !font-semibold '
                >
                  <Typography variant='button3'>Lưu</Typography>
                </ButtonCustom>
              </div>
            ) : (
              <ButtonCustom
                variant='contained'
                startIcon={<PencilSimple />}
                onClick={() => setIsEdit(true)}
                className='!bg-[var(--primary)] !text-[var(--white)] !font-semibold'
              >
                <Typography variant='button3'>Chỉnh sửa trang</Typography>
              </ButtonCustom>
            )}
          </div>
        </div>
      </div>
      {pages && (
        <GridLayoutCustom
          layouts={pages}
          isEdit={isEdit}
          dashboardId={dashboard?.id}
          updatePageWidget={(widget) => updateLayout(activePage, widget)}
          updateLayout={(layout) => updateLayout(activePage, layout)}
          data={pages.find((item) => item.pageId === activePage)?.widgets}
        />
      )}
    </div>
  );
};

export default PageComponent;
