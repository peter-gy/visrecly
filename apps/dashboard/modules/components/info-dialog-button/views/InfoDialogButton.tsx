import { InfoIcon } from '../../icons/views/Info';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ReactNode, useState } from 'react';

type InfoDialogButtonProps = {
  tooltip: string;
  title: string;
  description: string | ReactNode;
};

function InfoDialogButton({
  tooltip,
  title,
  description,
}: InfoDialogButtonProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton onClick={handleClickOpen}>
          <InfoIcon className="text-white" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="info-dialog-title"
        aria-describedby="info-dialog-description"
      >
        <DialogTitle id="info-dialog-title">{title}</DialogTitle>
        <DialogContent className="min-w-[50vw]">
          {typeof description === 'string' && (
            <DialogContentText id="info-dialog-slide-description">
              {description}
            </DialogContentText>
          )}
          {typeof description === 'object' && (
            <div id="info-dialog-slide-description">{description}</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default InfoDialogButton;
