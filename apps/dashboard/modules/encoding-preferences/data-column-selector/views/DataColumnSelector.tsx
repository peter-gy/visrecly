import { SyntheticEvent, useState } from 'react';
import tw from 'twin.macro';

import { Snackbar } from '@mui/material';

import { Alert } from '@dashboard/modules/components/alert-message/views/AlertMessage';
import { snakeCaseToHumanCase } from '@dashboard/modules/encoding-preferences/data-column-selector/utils/utils';
import DataColumnTypeIcon from '@dashboard/modules/encoding-preferences/data-column-selector/views/DataColumnTypeIcon';
import { useRecInput } from '@dashboard/modules/rec-input/provider/RecInputContext';
import { DataColumn as DataColumnType } from '@dashboard/modules/rec-input/types/types';

function DataColumnSelector() {
  const {
    state: { availableDataColumns, selectedDataColumns },
    dispatch,
  } = useRecInput();
  const handleSelect = (columns: DataColumnType[]) => {
    dispatch({
      type: 'setSelectedDataColumns',
      data: columns.map(({ name }) => name),
    });
  };
  return (
    <_DataColumnSelector
      availableDataColumns={availableDataColumns}
      selectedDataColumns={selectedDataColumns}
      onSelect={handleSelect}
    />
  );
}

type DataColumnSelectorProps = {
  availableDataColumns: DataColumnType[];
  selectedDataColumns: DataColumnType[];
  onSelect: (columns: DataColumnType[]) => void;
};

const NUM_MAX_COLUMNS = 5;

function _DataColumnSelector({
  availableDataColumns,
  selectedDataColumns,
  onSelect,
}: DataColumnSelectorProps) {
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClick = (column: DataColumnType) => {
    const newSelectedColumns =
      selectedDataColumns.find((c) => c.name === column.name) !== undefined
        ? selectedDataColumns.filter((c) => c.name !== column.name)
        : [...selectedDataColumns, column];
    if (newSelectedColumns.length > NUM_MAX_COLUMNS) {
      setSnackBarOpen(true);
      return;
    }
    onSelect(newSelectedColumns);
  };

  const handleSnackbarClose = (
    event?: SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  return (
    <div className="flex flex-col">
      {availableDataColumns.map(({ name, type }) => {
        const isSelected =
          selectedDataColumns.find((col) => col.name === name) !== undefined;
        return (
          <DataColumn
            key={`data-column-${name}`}
            name={name}
            type={type}
            isSelected={isSelected}
            onClick={() => handleClick({ name, type })}
          />
        );
      })}
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="warning">
          Sorry, maximum {NUM_MAX_COLUMNS} columns can be selected at once.
        </Alert>
      </Snackbar>
    </div>
  );
}

type DataColumnProps = {
  name: string;
  type: string;
  isSelected: boolean;
  onClick: () => void;
};

const styles = {
  container: ({ isSelected }: { isSelected: boolean }) => [
    tw`my-1 flex space-x-2 items-center border-2 cursor-pointer transition-all duration-[250ms]`,
    tw`hover:bg-primary-100`,
    tw`active:bg-primary-200 active:scale-105`,
    isSelected && tw`bg-primary-700 hover:bg-primary-600 text-white`,
  ],
};

function DataColumn({ name, type, isSelected, onClick }: DataColumnProps) {
  const humanCasedName = snakeCaseToHumanCase(name);
  return (
    <div css={styles.container({ isSelected })} onClick={onClick}>
      <div className="p-2">
        <DataColumnTypeIcon type={type} />
      </div>
      <p>{humanCasedName}</p>
    </div>
  );
}

export default DataColumnSelector;
