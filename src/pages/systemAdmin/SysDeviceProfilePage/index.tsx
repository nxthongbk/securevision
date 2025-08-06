import { Button, ListItemIcon, MenuItem, Typography, useMediaQuery } from '@mui/material';
import { IDeviceTypeContent, IRowDataTabelDeviceProfile } from '~/@types/deviceProfile/deviceProfile.type';
import { translation, translationCapitalFirst } from '~/utils/translate';
import { useEffect, useMemo, useState } from 'react';
import { useGetDataDeviceProfiles, useGetDataDeviceType } from './handleApi';

import CardDeviceProfile from './Card/CardDeviceProfile';
import ColumnsTable from './Column';
import CustomDataGrid from '~/components/DataGrid/CustomDataGrid';
import DataGridHeader from '~/components/DataGrid/DataGridHeader';
import DropDownActionTable from '~/components/DropdownActionTable';
import { FilterInterface } from '~/components/DataGrid/DataGridHeader';
import { GridRowParams } from '@mui/x-data-grid';
import HandleScrollPage from '~/components/HandleScrollPage';
import { IOptionInterface } from '~/@types/filterType/filter.type';
import IconPhosphor from '~/assets/iconPhosphor';
import { Link } from 'react-router-dom';
import ListCard from '../../../components/ListCard';
import PaginationComponent from '~/components/DataGrid/Pagination';
import PopupAdd from './Popup/PopupAdd';
import PopupDelete from './Popup/PopupDelete';
import PopupEdit from './Popup/PupupEdit';
import PopupInforDeviceProfile from './Popup/PopupInfor';
import PopupViewDevice from './Popup/PopupViewDevice';
import theme from '~/assets/theme';

export default function SysDeviceProfilePage() {
  const [keyword, setKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(30);
  const [page, setPage] = useState<number>(1);
  const [types, setTypes] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [rowSected, setRowSelected] = useState<IRowDataTabelDeviceProfile>();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));
  const handleOpenInfo = (row: any) => {
    setShowPopup(true);
    setRowSelected(row);
  };
  const handleCloseEdit = () => {
    setShowPopup(false);
  };

  const { data, isLoading } = useGetDataDeviceProfiles(page - 1, size, keyword, types);
  const { dataDeviceTypeR } = useGetDataDeviceType({ keyword: '', page: 0, size: 1000 });

  const optionsType = useMemo(() => {
    let options: IOptionInterface[] = [];
    if (dataDeviceTypeR?.data) {
      options = dataDeviceTypeR?.data?.content?.map((item: IDeviceTypeContent) => {
        const temp: IOptionInterface = {
          id: item?.id,
          name: item?.label,
          value: item?.id
        };
        return temp;
      });
      if (!options?.length) {
        options = [{ id: 'no', name: 'Không có dữ liệu', value: '' }];
      }
    }
    return options;
  }, [dataDeviceTypeR?.data]);

  const rows = useMemo(() => {
    if (data) {
      // eslint-disable-next-line prefer-const
      let rowTemp: IRowDataTabelDeviceProfile[] = data?.content?.map((item: IRowDataTabelDeviceProfile) => {
        const temp = {
          ...item,
          typeName: item?.type?.label,
          action: item.id,
          stt: String(item?.code).padStart(4, '0')
        };
        return temp;
      });
      return rowTemp || [];
    }
  }, [data]);
  // eslint-disable-next-line prefer-const
  let total: number = useMemo(() => {
    if (data) {
      // eslint-disable-next-line prefer-const
      let totalTemp = data?.total;
      return totalTemp;
    } else {
      return 0;
    }
  }, [data]);

  const onRowClick = (params: GridRowParams) => {
    console.log(params);
  };

  const filter: FilterInterface[] = [
    {
      id: 'choose-company',
      label: 'Loại thiết bị',
      onChange(e: any) {
        setTypes([...e?.target?.value]);
      },
      value: types,
      isHiddenPlacehoder: !types.length,
      placeholder: 'deviceProfile.choose-device-type',
      option: optionsType,
      multiselect: true
    }
  ];

  useEffect(() => {
    setPage(1);
  }, [keyword, types]);

  const handleResetFilter = () => {
    setTypes([]);
    // setKeyword('');
  };
  return (
    <HandleScrollPage
      props={{
        title: translationCapitalFirst('device-profile', 'deviceProfile'),
        btnPopup: <PopupAdd />
      }}
    >
      <DataGridHeader
        isSearch
        keyword={keyword}
        setKeyword={setKeyword}
        filter={filter}
        disableResetFilter={!types.length}
        handleResetFilter={handleResetFilter}
        title={translationCapitalFirst('device-profile', 'deviceProfile')}
        btnPopup={<PopupAdd />}
      />
      {isTablet ? (
        <ListCard>
          {rows?.map((row) => (
            <CardDeviceProfile
              action={
                <DropDownActionTable
                  childrent={() => [
                    {
                      key: 'view',
                      component: (
                        <MenuItem>
                          <Link to={`/device-management?deviceProfile=${row?.id}`}>
                            <div className='flex items-center justify-start w-full'>
                              <ListItemIcon>
                                <IconPhosphor iconName='Cpu' size={20} />
                              </ListItemIcon>
                              <Typography variant='body3'>{translationCapitalFirst('view-devices', 'deviceProfile')}</Typography>
                            </div>
                          </Link>
                        </MenuItem>
                      )
                    },
                    {
                      key: 'view-device',
                      component: (
                        <PopupInforDeviceProfile
                          openInfo={showPopup}
                          stt={row?.id}
                          imageUrl={row?.imageUrl}
                          name={row?.name}
                          signalWaitingTime={row?.signalWaitingTime}
                          totalDevices={row.totalDevices}
                          type={row?.type}
                          description={row?.description}
                          footerBtn={
                            <Button
                              fullWidth
                              variant='contained'
                              color='primary'
                              startIcon={<IconPhosphor iconName='PencilSimple' size={20} color='white' />}
                              onClick={() => {
                                handleOpenInfo(row);
                              }}
                            >
                              <Typography variant='button3' color='white'>
                                {translationCapitalFirst('update')}
                              </Typography>
                            </Button>
                          }
                        />
                      )
                    },
                    {
                      key: 'delete',
                      component: <PopupDelete id={row.id} totalDevices={row?.totalDevices?.total} />
                    }
                  ]}
                  mainBtn={<PopupViewDevice id={row.id} />}
                />
              }
              iconCard={row.imageUrl}
              nameCard={row.name}
              codeCard={row.code}
            />
          ))}
          <PaginationComponent page={page} setPage={setPage} size={size} setSize={setSize} total={total} />
        </ListCard>
      ) : (
        <CustomDataGrid
          rows={rows}
          columns={ColumnsTable({ handleOpenInfo, openPopup: showPopup })}
          page={page}
          setPage={setPage}
          handleRowClick={onRowClick}
          size={size}
          setSize={setSize}
          total={total}
          rowHeight={56}
          emptyMessage={
            keyword ? translationCapitalFirst('no-data') : translationCapitalFirst('no-device-profile', 'deviceProfile')
          }
          explainName={translation('device-profile', 'deviceProfile')}
          loading={isLoading}
        />
      )}
      {showPopup && <PopupEdit props={{ openEdit: showPopup, handleCloseEdit, ...rowSected }} />}
    </HandleScrollPage>
  );
}
