'use client';

import type { FC, FormEvent } from 'react';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  FieldErrors,
  FormProvider,
  useForm,
  useFormContext
} from 'react-hook-form';
import { toast } from 'sonner';

import { Permission, Role, RolePermission } from '../../role.interface';
import { RoleDto, roleSchema } from '../../role.schema';
import { RoleService } from '../../role.service';

import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { TOAST_DURATION_TIME } from '@/config/constants/app.constants';
import { CustomError } from '@/config/custom.error';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/env';
import { ErrorMapper } from '@/config/error.mapper';
import { customFaker } from '@/config/utils/faker.util';
import { DataResponse } from '@/interfaces/data-response.interface';
import { FontWeight } from '@/theme/font-weight';

type RoleFormProps =
  | { mode: ModeAction.Create; permissions: RolePermission[] }
  | {
      mode: Exclude<ModeAction, ModeAction.Create>;
      role: Role;
      permissions: RolePermission[];
    };

export const RoleForm: FC<RoleFormProps> = props => {
  const { mode, permissions } = props;
  const role = 'role' in props ? props.role : null;
  const navigate = useNavigate();

  const defaultValues = useMemo<RoleDto>(() => {
    if (role && mode !== ModeAction.Create) {
      return {
        mode,
        id: +role.id,
        name: role.description,
        permissions: role.permissions.map(permission => permission.name),
        active: role.active
      };
    }

    if (Environment.isProd) {
      return {
        mode: ModeAction.Create,
        name: '',
        permissions: [],
        active: true
      };
    }

    const randomPermissions = customFaker.helpers
      .arrayElements(permissions, 2)
      .map(permission => permission.name);

    return {
      mode: ModeAction.Create,
      name: `Rol ${customFaker.word.adjective()}`.toTitleCase(),
      permissions: randomPermissions,
      active: true
    };
  }, [role, mode, permissions]);

  const methods = useForm<RoleDto>({
    mode: 'onBlur',
    resolver: zodResolver(roleSchema),
    defaultValues
  });

  const { handleSubmit, control, setError, reset } = methods;

  const roleMutation = useMutation<DataResponse<Role>, unknown, RoleDto>({
    mutationFn: data => {
      if (mode === ModeAction.Create) return RoleService.createRole(data);
      if (mode === ModeAction.Edit && role)
        return RoleService.updateRoleAction(role.id, data);
      throw new CustomError(`El modo ${mode} no es válido para la operación`);
    },
    onSuccess: ({ data }) => {
      // invalidateModules(['role'], queryClient);
      navigate({
        to: '/roles/$roleId/edit',
        params: { roleId: String(data.id) }
      });
    },
    onError: error => {
      const newError = ErrorMapper.mapErrorToApiResponse(error);

      for (const key in newError.errors) {
        const newKey = key as keyof RoleDto;
        const message = newError.errors[key][0];

        message && setError(newKey, { type: 'manual', message });
      }
      ErrorMapper.throwMappedError(error);
    }
  });

  const onSave = useCallback(
    async (data: RoleDto) => {
      toast.promise(roleMutation.mutateAsync(data), {
        loading: 'Guardando...',
        success: ({ message }) => {
          return message;
        },
        error: ({ message }) => message
      });
    },
    [roleMutation]
  );

  const showErrors = useCallback(
    (errors: FieldErrors<RoleDto>) => {
      for (const key in errors) {
        const errorKey = key as keyof RoleDto;
        const message = errors[errorKey]?.message;

        if (message) {
          toast.error(message, { duration: TOAST_DURATION_TIME });
          setError(errorKey, { type: 'manual', message });
        }
      }
    },
    [setError]
  );

  useEffect(() => {
    if (role) reset(defaultValues);
  }, [defaultValues, reset, role]);

  const isDisabled = useMemo(
    () => roleMutation.isPending || [ModeAction.Show].includes(mode),
    [roleMutation.isPending, mode]
  );

  return (
    <FormProvider {...methods}>
      <Fade in timeout={500}>
        <form noValidate onSubmit={handleSubmit(onSave, showErrors)}>
          <Grid container spacing={3}>
            <Grid size={6}>
              <CustomFormTextField
                fullWidth
                required
                fieldType='text'
                control={control}
                label='Nombre'
                name='name'
                disabled={isDisabled}
                onInput={(e: FormEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLInputElement;

                  target.value = target.value.replace(/[^A-Za-z\s]/g, '');
                }}
              />
            </Grid>
            <Grid size={6}>
              <CustomFormTextField
                fieldType='switch'
                control={control}
                label='Estado'
                name='active'
                disabled={isDisabled}
                labelTrue='Activo'
                labelFalse='Inactivo'
              />
            </Grid>

            <Grid size={12}>
              <Typography
                gutterBottom
                variant='body1'
                fontWeight={FontWeight.medium}
              >
                Permisos
              </Typography>
              <Fade in timeout={800}>
                <Box>
                  <PermissionContainer
                    permissions={permissions}
                    isDisabled={isDisabled}
                    mode={mode}
                  />
                </Box>
              </Fade>
            </Grid>
            {!isDisabled && (
              <Grid
                size={12}
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '5px'
                }}
              >
                <Button
                  variant='outlined'
                  color='cancel'
                  onClick={() => navigate({ to: '/users' })}
                >
                  Cancelar
                </Button>
                <Button
                  color='primary'
                  type='submit'
                  disabled={roleMutation.isPending || isDisabled}
                  variant={roleMutation.isPending ? 'outlined' : 'contained'}
                >
                  {
                    {
                      [ModeAction.Create]: roleMutation.isPending
                        ? 'Creando rol...'
                        : 'Crear rol',
                      [ModeAction.Edit]: roleMutation.isPending
                        ? 'Guardando rol...'
                        : 'Guardar rol'
                    }[String(mode)]
                  }
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Fade>
    </FormProvider>
  );
};

interface PermissionContainerProps {
  permissions: RolePermission[];
  isDisabled: boolean;
  mode: ModeAction;
}

const getModuleTranslation = (moduleName: string) => {
  return moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
};

const PermissionContainer: FC<PermissionContainerProps> = ({
  permissions,
  mode
}) => {
  const { getValues, setValue, watch } = useFormContext<RoleDto>();
  const [expanded, setExpanded] = useState<string | false>(false);

  const selectedPermissions = watch('permissions');

  const groupedPermissions = useMemo(
    () =>
      permissions.reduce(
        (groups, permission) => {
          const [module] = permission.name.split('.');

          groups[module] = [...(groups[module] || []), permission];

          return groups;
        },
        {} as Record<string, RolePermission[]>
      ),
    [permissions]
  );

  const modules = useMemo(() => {
    return Object.keys(groupedPermissions)
      .map(moduleId => ({
        id: moduleId,
        name: getModuleTranslation(moduleId),
        permissions: groupedPermissions[moduleId]
      }))
      .filter(module => {
        if (mode === ModeAction.Show) {
          return module.permissions.some(p =>
            selectedPermissions.includes(p.name)
          );
        }

        return module.permissions.length > 0;
      });
  }, [groupedPermissions, mode, selectedPermissions]);

  const toggleAllModulePermissions = useCallback(
    (modulePermissions: RolePermission[], checked: boolean) => {
      const permissionNames = modulePermissions.map(p => p.name);
      const currentPermissions = getValues('permissions');
      const newPermissions = checked
        ? [...new Set([...currentPermissions, ...permissionNames])]
        : currentPermissions.filter(
            name => !permissionNames.includes(name as Permission)
          );

      setValue('permissions', newPermissions, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  const toggleAllPermissions = useCallback(() => {
    const allPermissionNames = permissions.map(p => p.name);
    const currentPermissions = getValues('permissions');
    const allSelected = permissions.every(p =>
      currentPermissions.includes(p.name)
    );

    const newPermissions = allSelected ? [] : allPermissionNames;

    setValue('permissions', newPermissions, { shouldDirty: true });
  }, [getValues, permissions, setValue]);

  const onChangeAccordion = useCallback(
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  const totalPermissions = useMemo(() => permissions.length, [permissions]);
  const selectedCount = useMemo(
    () => selectedPermissions.length,
    [selectedPermissions]
  );
  const selectionPercentage = useMemo(
    () =>
      totalPermissions > 0
        ? Math.round((selectedCount / totalPermissions) * 100)
        : 0,
    [selectedCount, totalPermissions]
  );

  const isDisabled = useMemo(() => mode === ModeAction.Show, [mode]);

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {![ModeAction.Show].includes(mode) && (
            <>
              <Checkbox
                indeterminate={
                  selectedCount > 0 && selectedCount < totalPermissions
                }
                checked={
                  selectedCount === totalPermissions && totalPermissions > 0
                }
                color='primary'
                disabled={isDisabled}
                onChange={() => toggleAllPermissions()}
              />

              <Typography
                variant='subtitle1'
                sx={{ fontWeight: FontWeight.bold, cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation();
                  toggleAllPermissions();
                }}
              >
                Seleccionar todo
              </Typography>
            </>
          )}
        </Box>
        <Chip
          label={`${selectedCount}/${totalPermissions} (${selectionPercentage}%)`}
          color={selectedCount > 0 ? 'primary' : 'default'}
          size='small'
          icon={selectedCount > 0 ? <CheckCircleOutlineIcon /> : undefined}
        />
      </Box>

      <Stack spacing={2}>
        {modules.length === 0 && (
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ fontStyle: 'italic' }}
          >
            No hay permisos asignados a este rol.
          </Typography>
        )}
        {modules.map(({ id, name, permissions: modulePermissions }) => {
          const originalPermissions = groupedPermissions[id] || [];

          const moduleSelected = originalPermissions.every(p =>
            selectedPermissions.includes(p.name)
          );
          const someSelected = originalPermissions.some(p =>
            selectedPermissions.includes(p.name)
          );
          const selectedModuleCount = originalPermissions.filter(p =>
            selectedPermissions.includes(p.name)
          ).length;

          const displayPermissions =
            mode === ModeAction.Show
              ? modulePermissions.filter(p =>
                  selectedPermissions.includes(p.name)
                )
              : modulePermissions;

          return (
            <Accordion
              key={id}
              expanded={expanded === id}
              sx={{
                borderRadius: '8px',
                '&:before': { display: 'none' },
                boxShadow: theme =>
                  `0 2px 6px ${alpha(theme.palette.primary.main, 0.05)}`,
                border: '1px solid',
                borderColor: someSelected ? 'primary.light' : 'divider'
              }}
              onChange={onChangeAccordion(id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center'
                  }
                }}
              >
                {!isDisabled ? (
                  <Checkbox
                    disabled={isDisabled}
                    indeterminate={someSelected && !moduleSelected}
                    checked={moduleSelected}
                    color='primary'
                    onChange={e => {
                      e.stopPropagation();
                      toggleAllModulePermissions(
                        originalPermissions,
                        e.target.checked
                      );
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <Box sx={{ mr: 2 }} />
                )}

                <Typography
                  variant='subtitle1'
                  sx={{ fontWeight: FontWeight.bold, mr: 2 }}
                >
                  {name}
                </Typography>
                <Chip
                  size='small'
                  label={`${selectedModuleCount}/${originalPermissions.length}`}
                  color={someSelected ? 'primary' : 'default'}
                  sx={{ ml: 1 }}
                />
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={1}>
                  {displayPermissions.map(permission => (
                    <PermissionCell
                      key={permission.name}
                      mode={mode}
                      permission={permission}
                    />
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Stack>
  );
};

interface PermissionCellProps {
  permission: RolePermission;
  mode: ModeAction;
}

const getPermissionTranslation = (
  permissionName: string,
  dbDescription: string
): string => {
  return dbDescription;
};

const PermissionCell: FC<PermissionCellProps> = ({ permission, mode }) => {
  const { watch, setValue, getValues } = useFormContext<RoleDto>();
  const selectedPermissions = watch('permissions');

  const isChecked = useMemo(
    () => selectedPermissions.includes(permission.name),
    [selectedPermissions, permission.name]
  );

  const permissionDescription = useMemo(
    () => getPermissionTranslation(permission.name, permission.description),
    [permission.name, permission.description]
  );

  const togglePermission = useCallback(
    (permissionName: string, checked: boolean) => {
      const permissions = getValues('permissions');
      const newPermissions = checked
        ? [...permissions, permissionName]
        : permissions.filter(name => name !== permissionName);

      setValue('permissions', newPermissions, { shouldDirty: true });
    },
    [getValues, setValue]
  );

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Tooltip arrow title={permissionDescription} placement='top'>
        {mode === ModeAction.Show ? (
          <Stack direction='row' alignItems='center' spacing={1}>
            <Checkbox
              disabled
              checked={isChecked}
              size='small'
              sx={{ pointerEvents: 'none' }}
            />
            <Typography variant='body2'>{permissionDescription}</Typography>
          </Stack>
        ) : (
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                size='small'
                sx={{
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' },
                  ...(isChecked && { color: 'primary.main' })
                }}
                onChange={e =>
                  togglePermission(permission.name, e.target.checked)
                }
              />
            }
            label={
              <Typography
                variant='body2'
                sx={{
                  fontSize: 14,
                  color: isChecked ? 'primary.main' : 'text.primary'
                }}
              >
                {permissionDescription}
              </Typography>
            }
            sx={{
              width: '100%',
              margin: 0,
              padding: '4px 8px',
              borderRadius: '4px',

              '&:hover': {
                bgcolor: theme => alpha(theme.palette.primary.main, 0.04)
              },
              ...(isChecked && {
                bgcolor: theme => alpha(theme.palette.primary.main, 0.08)
              })
            }}
          />
        )}
      </Tooltip>
    </Grid>
  );
};
