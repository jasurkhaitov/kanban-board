// import { TaskProps } from './Task.props';
import { Box, IconButton, ScaleFade, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { AutoResizeTextArea } from '../AutoResizeTextArea/AutoResizeTextArea';
import { useTaskDragAndDrop } from '../../hooks/useTaskDragAndDrop';
import { memo } from 'react';
import _ from 'lodash';
import { TaskModel } from '../../utils/models';

type TaskProps = {
  index: number;
  task: TaskModel;
  onUpdate: (id: TaskModel['id'], updatedTask: TaskModel) => void;
  onDelete: (id: TaskModel['id']) => void;
  onDropHover: (i: number, j: number) => void;
};

function Task({
  index,
  task,
  onUpdate: handleUpdate,
  onDropHover: handleDropHover,
  onDelete: handleDelete,
}: TaskProps) {
  const { ref, isDragging } = useTaskDragAndDrop<HTMLDivElement>(
    { task, index: index },
    handleDropHover,
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    handleUpdate(task.id, { ...task, title: newTitle });
  };

  const toast = useToast();
  const createTost = () => {
    return {
      position: 'bottom-left',
      render: toast({
        position: 'bottom-left',
        render: () => (
          <Box
            rounded='lg'
            color='white'
            p={2}
            bg='green.500'
            textAlign='center'
          >
            Task successfully deleted!
          </Box>
        )
      })
    }
  }

  const handleDeleteClick = () => {
    handleDelete(task.id);
    createTost();
  };

  return (
    <ScaleFade in={true} unmountOnExit>
      <Box
        ref={ref}
        as="div"
        role="group"
        position="relative"
        rounded="lg"
        w={{ base: 220, md: "full" }}
        pl={3}
        pr={7}
        pt={3}
        pb={1}
        boxShadow="xl"
        cursor="grab"
        fontWeight="bold"
        userSelect="none"
        bgColor={task.color}
        opacity={isDragging ? 0.5 : 1}
      >
        <IconButton
          position="absolute"
          bottom={0}
          right={0}
          zIndex={100}
          aria-label="delete-task"
          size="lg"
          colorScheme="solid"
          color={'gray.700'}
          icon={<DeleteIcon />}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          onClick={handleDeleteClick}
        />
        <AutoResizeTextArea
          value={task.title}
          fontWeight="semibold"
          cursor="inherit"
          border="none"
          p={0}
          resize="none"
          minH={55}
          maxH={200}
          focusBorderColor="none"
          color="gray.900"
          lineHeight={1.5}
          onChange={handleTitleChange}
        />
      </Box>
    </ScaleFade>
  );
}

export default memo(Task, (prev, next) => {
  if (
    _.isEqual(prev.task, next.task) &&
    _.isEqual(prev.index, next.index) &&
    prev.onDelete === next.onDelete &&
    prev.onDropHover === next.onDropHover &&
    prev.onUpdate === next.onUpdate
  ) {
    return true;
  }

  return false;
});