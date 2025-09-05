import { yupResolver } from '@hookform/resolvers/yup';
import { useSearchBoxCore } from '@mapbox/search-js-react';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { Check, Phone, Plus, X } from '@phosphor-icons/react';
import { debounce } from 'lodash';
import mapboxgl, { LngLatBounds, LngLatLike } from 'mapbox-gl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GlobalError, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MarkerDragEvent } from 'react-map-gl';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import MapBox from '~/components/MapBox';
import MarkerMap from '~/components/Marker';
import SelectCustom from '~/components/SelectCustom';
import AvatarUpload from '~/components/avatar-upload';
import AvatarTableTenant from '~/pages/systemAdmin/SysTenantManagementPage/AvatarTenant';
import locationService from '~/services/location.service';
import { UserRole } from '~/utils/constant';
import useLazyQuery from '~/utils/hooks/useLazyQuery';
import handleNotificationMessege from '~/utils/notification';
import { useGetStaffs } from '../../UserPage/handleApi';
import SearchOption from '../SearchBox/SearchOption';
import SearchResultsContainer from '../SearchBox/SearchResult';
import AutocompleteSearchTextField from '../SearchBox/SearchTextField';
import { useCreateLocation, useUpdateLocation } from '../handleApi';
import { ManipulationLocationProps } from '../type';
import { GEO_COORDINATE_REGEX, SearchBoxOption, coordinateFeature } from '../utils';
import { useDeleteFileAvatar, useUploadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';
import fileStorageService from '~/services/fileStorage.service';

const sessionId = uuidv4();

const defaultValues = {
  locationName: '',
  address: '',
  tenantCode: '',
  latLng: [10.79598305771536, 106.67863006768668],
  operatorId: '',
  imageUrl: null
};

const PopupManipulateLocation = ({
  locationId,
  tenantCode,
  forceOpen,
  onClose,
  userRole
}: ManipulationLocationProps) => {
  const [locationTranslate] = useTranslation('', { keyPrefix: 'locationPage' });
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SearchBoxOption[]>([]);
  const [searchValue, setSearchValue] = useState<SearchBoxOption | null>(null);
  const [popupContent, setPopupContent] = useState<string>('');
  const [isAutofill, setAutofill] = useState<boolean>(false);
  const [_imageFile, setFileImage] = useState();
  const [imageBlob, setImageBlob] = useState<string>('');
  const mapInstanceRef = useRef();
  const isAdmin = userRole === UserRole.SYSADMIN;

  const { data: dataStaffs } = useGetStaffs({
    keyword: '',
    page: 0,
    size: 200,
    tenantCode,
    locationId: '',
    permissionGroupId: ''
  });

  const { mutate: createLocation, isSuccess: createSuccess, isPending: pendingCreate } = useCreateLocation();
  const { mutate: updateLocation, isSuccess: updateSuccess, isPending: pendingUpdate } = useUpdateLocation();

  const { dataFile, mutateUploadFile, resetUploadFile } = useUploadFileAvatar();
  const { mutateDeleteFile } = useDeleteFileAvatar();

  const handleFileUpload = (file: any) => {
    setFileImage(file);
  };

  // Form Schema
  const validationSchema = yup.object().shape({
    locationName: yup
      .string()
      .required(locationTranslate('please_enter_location_name'))
      .trim()
      .max(255, locationTranslate('location_name_too_long')),
    address: yup
      .string()
      .required(locationTranslate('please_enter_address'))
      .trim()
      .max(255, locationTranslate('address_too_long')),
    tenantCode: yup.string(),
    imageUrl: yup.string().nullable(),
    operatorId: yup.string(),
    latLng: yup.array().of(yup.number()).length(2).default(defaultValues.latLng)
  });

  const searchBoxCore = useSearchBoxCore({
    accessToken: import.meta.env.VITE_SEARCH_BOX_API_TOKEN
  });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    reset,
    getValues,
    register,
    clearErrors
  } = useForm<yup.InferType<typeof validationSchema>>({
    defaultValues,
    mode: 'all',
    resolver: yupResolver(validationSchema)
  });

  // Lazy Query
  const [trigger, { data: locationDetail }] = useLazyQuery(
    ['getLocationDetail', { tenantCode, locationId }],
    () => locationService.getLocationDetail(locationId, tenantCode),
    { staleTime: 3000 }
  );

  useEffect(() => {
    // Only open edit popup -> Fetch location detail
    if (locationId && tenantCode && forceOpen) {
      setOpen(true);
      trigger();
    }
  }, [forceOpen, locationId, tenantCode, trigger]);

  useEffect(() => {
    if (locationDetail && locationId) {
      const data = locationDetail?.['data'] || {};
      if (data) {
        if (data.imageUrl) {
          fileStorageService.getFileImage(data.imageUrl).then((res: unknown) => {
            const url = URL.createObjectURL(res as Blob);
            setImageBlob(url);
          });
        }
        reset({
          address: data.address,
          locationName: data.name,
          tenantCode: data?.tenantInfo?.code,
          latLng: [data.location?.latitude, data.location?.longitude],
          operatorId: data?.operatorInfo?.id || '',
          imageUrl: data.imageUrl || null
        });
      }
    }
  }, [locationDetail, locationId, reset, setValue]);

  // Set Image Url when upload new image
  useEffect(() => {
    if (dataFile?.id) {
      setValue('imageUrl', dataFile.id, {
        shouldValidate: true
      });
    }
  }, [dataFile?.id, setValue]);

  const handleClose = useCallback(() => {
    reset();
    setPopupContent('');
    setOpen(false);
    setSearchValue(null);
    onClose?.();
    setFileImage(null);
  }, [onClose, reset]);

  useEffect(() => {
    if (_imageFile) {
      mutateUploadFile(_imageFile);
    }
    const upsertNotSuccess = !createSuccess && !updateSuccess;
    if (dataFile?.id && upsertNotSuccess) {
      mutateDeleteFile(dataFile?.id);
      resetUploadFile();
    }
  }, [_imageFile]);

  const getError = (field: keyof yup.InferType<typeof validationSchema>): GlobalError | undefined => {
    return errors[field];
  };

  const onLoadMap = (evt: any) => {
    mapInstanceRef.current = evt?.target;
    setMap(evt?.target);
  };

  const popup = useMemo(
    () => new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false, className: 'pb-[8px]' }),
    []
  );

  useEffect(() => {
    const latLng = getValues('latLng');
    if (map && latLng) {
      const value = {
        id: '',
        label: `${latLng[0]}, ${latLng[1]}`,
        feature: { center: [latLng[1], latLng[0]] }
      } as SearchBoxOption;
      map?.flyTo({
        center: [latLng[1], latLng[0]],
        zoom: locationId ? 17 : 9
      });
      setSearchValue(value);
    }
  }, [map]);

  useEffect(() => {
    if (popup && map) {
      const htmlContent =
        popupContent ||
        `<div class="px-[16px] py-[8px]"><p class="text-base font-semibold">${getValues('latLng')?.[0]}, ${getValues('latLng')?.[1]}</p></div>`;

      popup
        .setHTML(htmlContent)
        .setMaxWidth(htmlContent.length > 150 ? '350px' : 'fit-content')
        .addTo(map);
    }
  }, [popup, map, popupContent, getValues]);

  const handleChangeMapView = (bbox: [number, number, number, number], centerPoint: LngLatLike) => {
    if (bbox) {
      const bounds = new LngLatBounds(bbox);
      map?.fitBounds(bounds, {
        center: centerPoint,
        animate: true
      });
    } else {
      map?.flyTo({
        center: centerPoint,
        zoom: 17
      });
    }
  };

  const handleManualDragMarker = (e: MarkerDragEvent) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;

    setValue('latLng', [lat, lng]);
    setPopupContent(`<div class="px-[16px] py-[8px]"><p class="text-base font-semibold">${lat}, ${lng}</p></div>`);

    if (isAutofill) {
      setValue('address', '');
      setValue('locationName', '');
      setAutofill(false);
    }

    setSearchValue({
      id: '',
      label: `${lat}, ${lng}`,
      feature: { center: [lng, lat] }
    } as SearchBoxOption);

    setOptions([]);
    map?.flyTo({
      center: e.lngLat,
      zoom: map.getZoom()
    });
  };

  const handleSelectValue = async (value: any | null) => {
    if (value) {
      if (value?.reverseLookup) {
        try {
          const reverse = await searchBoxCore.reverse([value?.lng, value?.lat]);
          const properties = reverse?.features[0]?.properties;
          const latitude = value?.lat ?? properties?.coordinates?.latitude;
          const longitude = value?.lng ?? properties?.coordinates?.longitude;
          handleChangeMapView(properties?.bbox, [longitude, latitude]);
          setValue('latLng', [latitude, longitude]);
          setPopupContent(
            `<div class="px-[16px] py-[8px]"><p class="text-base font-semibold">${latitude}, ${longitude}</p></div>`
          );
          if (isAutofill) {
            setValue('address', '');
            setValue('locationName', '');
          }
          setAutofill(false);
          setOptions([]);
        } catch (error) {
          handleNotificationMessege(error?.message ?? locationTranslate('mapbox-usage-limit-reached'), 'warning');
          console.error(error?.message);
        }
      } else {
        try {
          const { features } = await searchBoxCore.retrieve(value.feature, { sessionToken: sessionId });
          const properties = features[0]?.properties;

          // SET PROVINCE ID

          handleChangeMapView(properties?.bbox, [
            properties?.coordinates?.longitude,
            properties?.coordinates?.latitude
          ]);

          // Autofill
          setValue('address', properties?.full_address, { shouldValidate: true });
          setValue('locationName', properties?.name, { shouldValidate: true });
          setValue('latLng', [properties?.coordinates?.latitude, properties?.coordinates?.longitude]);

          properties?.full_address && clearErrors('address');
          properties?.name && clearErrors('locationName');

          setPopupContent(`<div class="p-[16px] flex gap-[1px] flex-col">
               <p class="text-base font-semibold">${properties?.name}</p>
               <p class="text-sm font-normal">(${properties?.coordinates?.latitude}, ${properties?.coordinates?.longitude})</p>
               <p class="text-sm font-normal">${properties?.full_address}</p>
             </div>
             `);
          setAutofill(true);
        } catch (err) {
          handleNotificationMessege(err?.message ?? locationTranslate('mapbox-usage-limit-reached'), 'warning');
          console.error(err?.message);
        }
      }
    }

    setSearchValue(value);
  };

  const search = debounce(async (input: string) => {
    if (input === '') {
      setSearchValue(null);
      setOptions([]);
      return;
    }

    // Check input is coordinate
    const matches = input.match(GEO_COORDINATE_REGEX);

    // If not, call Search Box Suggest API
    // if (!matches) {
    //   try {
    //     const results = await searchBoxCore.suggest(input, {
    //       sessionToken: sessionId
    //     });

    //     const options = results.suggestions.map((f) => ({
    //       label: f.name,
    //       id: f.mapbox_id,
    //       feature: f,
    //       fullAddress: f.full_address
    //     }));

    //     setOptions(options);
    //     return;
    //   } catch (error) {
    //     handleNotificationMessege(error?.message ?? locationTranslate('mapbox-usage-limit-reached'), 'warning');
    //     console.error(error?.message);
    //   }
    // }

    // Else, handle to call reverse lookup API
    if (matches) {
      const coord1 = Number(matches[1]);
      const coord2 = Number(matches[2]);
      const reverseLookupOptions = [];

      if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        reverseLookupOptions.push(coordinateFeature(coord1, coord2));
      }

      if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        reverseLookupOptions.push(coordinateFeature(coord2, coord1));
      }

      if (coord1 === 45 && coord2 === 45) {
        // must be lat, lng
        reverseLookupOptions.push({
          label: 'Vĩ độ: ' + 45 + ' Kinh độ: ' + 45,
          id: `4545`,
          reverseLookup: true,
          lat: 45,
          lng: 45
        });
      }

      if (reverseLookupOptions.length === 0) {
        // else could be either lng, lat or lat, lng
        reverseLookupOptions.push(coordinateFeature(coord1, coord2));
        reverseLookupOptions.push(coordinateFeature(coord2, coord1));
      }

      setOptions(reverseLookupOptions);
    } else {
      // Handle case where the input is not a valid coordinate
      setOptions([]);
    }
  }, 300);

  const handleManipulateLocation = handleSubmit(async (data) => {
    try {
      const requestBody = {
        tenantCode: tenantCode,
        name: data.locationName?.trim(),
        address: data.address?.trim(),
        status: 'ACTIVE',
        location: { latitude: data.latLng[0], longitude: data.latLng[1] },
        operatorId: data.operatorId,
        imageUrl: data.imageUrl
      };
      if (locationId) {
        updateLocation({ locationId, requestBody });
        return;
      }
      createLocation(requestBody);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    if (createSuccess || updateSuccess) handleClose();
  }, [createSuccess, handleClose, updateSuccess]);

  const staffFilterOption = dataStaffs?.data?.content || [];

  return (
    <>
      <Button
        variant='contained'
        color='primary'
        onClick={() => setOpen(true)}
        startIcon={<Plus size={20} color='white' />}
      >
        <Typography variant='button3' color='white'>
          {locationTranslate('add-new')}
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: 800,
            height: 1000
          }
        }}
        disableRestoreFocus
      >
        <DialogContent
          sx={{
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}
        >
          <Box>
            <Box className='flex justify-between items-center px-4 py-2.5'>
              <Typography color='var(--text-primary)' variant='h6'>
                {locationTranslate(locationId ? 'update-information' : 'add-new-location')}
              </Typography>
              <IconButton aria-label='close' onClick={handleClose}>
                <X size={20} />
              </IconButton>
            </Box>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
          </Box>
          <Stack className='gap-3.5 p-4 h-full overflow-scroll'>
            <div className='w-full justify-center items-center flex'>
              <AvatarUpload
                src={locationId ? imageBlob : null}
                onFileUpload={handleFileUpload}
                avatarSx={{ borderRadius: '8px' }}
                inputSx={{ borderRadius: '8px' }}
                asyncLoadAvatar
              />
            </div>
            <InputCustom
              sx={{ width: '100%' }}
              classNameContainer='w-full'
              label={locationTranslate(isAdmin ? 'location' : 'name')}
              control={control}
              name='locationName'
              placeholder={locationTranslate('enter-location-name')}
              isRequired={true}
              isError={!!getError('locationName')}
              helperText={errors?.locationName?.message}
            />
            <InputCustom
              sx={{ width: '100%' }}
              classNameContainer='w-full'
              label={locationTranslate('address-capitalize')}
              control={control}
              name='address'
              placeholder={locationTranslate('enter-address')}
              isRequired={true}
              isError={!!getError('address')}
              helperText={errors?.address?.message}
            />
            <SelectCustom
              control={control}
              name='operatorId'
              label={locationTranslate('manager')}
              placeholderText={locationTranslate('select-manager-placeholder')}
              displayEmpty
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: 400,
                      maxWidth: 770,
                      width: '100%'
                    }
                  }
                }
              }}
              slotProps={{
                root: {
                  className: '!h-auto',
                  sx: {
                    '& svg': {
                      top: 'unset !important'
                    }
                  }
                },
                input: { className: '!pr-[38px]' }
              }}
            >
              {staffFilterOption.map((staff, index) => (
                <MenuItem key={staff.id} value={staff.id} sx={{ pl: '10px' }}>
                  <Box className='flex justify-between w-full items-center'>
                    <Box className='flex gap-2 overflow-hidden'>
                      <AvatarTableTenant
                        sx={{ height: '32px', width: '32px', objectFit: 'cover', alignSelf: 'center' }}
                        avatarUrl={staff.avatarUrl}
                      />
                      <Stack className='overflow-hidden'>
                        <Typography variant='label3' className='overflow-hidden text-ellipsis'>
                          {staff.name}
                        </Typography>
                        <Typography variant='caption1'>{String(index + 1).padStart(4, '0')}</Typography>
                      </Stack>
                    </Box>
                    <Box className='flex gap-0.5'>
                      <Phone size={16} color='var(--text-secondary)' />
                      <Typography variant='caption1' color='var(--text-secondary)'>
                        {staff.phone}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </SelectCustom>
            <Box position='relative'>
              <Typography variant='label3'>
                {locationTranslate('coordinate')} <span className='text-[var(--semantic-alert)]'>*</span>
              </Typography>
              <Autocomplete
                ref={register('latLng' as any)?.ref}
                data-testid='geocoder-autocomplete'
                sx={{
                  height: '8px',
                  '& .MuiAutocomplete-inputRoot': {
                    p: '0px !important',
                    height: '40px',
                    background: 'white',
                    position: 'absolute',
                    top: '20px',
                    width: '95%',
                    left: '20px',
                    right: '20px',
                    zIndex: 1000
                  }
                }}
                freeSolo
                value={searchValue}
                options={options}
                fullWidth
                disablePortal
                isOptionEqualToValue={(option, value) => (value ? option.id === value.id : true)}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                filterSelectedOptions
                noOptionsText={locationTranslate('no-locations')}
                PaperComponent={SearchResultsContainer}
                filterOptions={(x) => x}
                renderInput={(params) => {
                  return <AutocompleteSearchTextField {...params} hasValue={!!searchValue} />;
                }}
                renderOption={(props, option) => (
                  <SearchOption
                    {...props}
                    label={option.label}
                    fullAddress={option.fullAddress}
                    key={option.id}
                    style={{ fontSize: '0.75rem' }}
                  />
                )}
                onChange={(_, newVal: SearchBoxOption | null) => handleSelectValue(newVal)}
                onInputChange={(_, newInputValue) => {
                  search(newInputValue);
                }}
              />
              <div className='w-full h-[472px] border border-[var(--grey-neutral-100)] rounded-lg overflow-hidden'>
                <MapBox
                  initialViewState={{
                    latitude: getValues('latLng')?.[0],
                    longitude: getValues('latLng')?.[1],
                    zoom: 3
                  }}
                  mapStyle={'mapbox://styles/mapbox/streets-v12'}
                  onLoad={onLoadMap}
                >
                  <MarkerMap
                    draggable
                    onDragEnd={handleManualDragMarker}
                    onDragStart={() => {
                      popup.remove();
                    }}
                    status='ACTIVE'
                    latitude={getValues('latLng')?.[0]}
                    longitude={getValues('latLng')?.[1]}
                    popup={popup}
                  />
                </MapBox>
              </div>
            </Box>
          </Stack>
          <Box>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
            <Box className='flex justify-end items-center p-4 gap-3'>
              <ButtonCustom variant='outlined' color='primary' onClick={handleClose} startIcon={<X size={18} />}>
                <Typography variant='button3' fontWeight={600}>
                  {locationTranslate('cancel')}
                </Typography>
              </ButtonCustom>
              <ButtonCustom
                variant='contained'
                color='primary'
                type='submit'
                onClick={handleManipulateLocation}
                startIcon={<Check size={18} />}
                disabled={!isValid}
                isLoading={pendingCreate || pendingUpdate}
              >
                <Typography variant='button3' fontWeight={600}>
                  {locationTranslate('save')}
                </Typography>
              </ButtonCustom>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupManipulateLocation;
