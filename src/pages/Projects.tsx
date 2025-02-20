// ... existing imports and component definition ...

const Projects = () => {
  // ... existing state declarations ...

  const handleOpenModal = (project?: Project) => {
    if (project) {
      const normalRule = project.overtimeRules?.find(rule => rule.type === 'WEEKDAY');
      const noturnaRule = project.overtimeRules?.find(rule => rule.type === 'NIGHT');
      const domingoFeriadoRule = project.overtimeRules?.find(rule => rule.type === 'SUNDAY_HOLIDAY');

      setEditingProject({
        ...project,
        estimated_end_date: project.estimated_end_date?.split('T')[0] || '',
        overtimeRules: {
          normal: normalRule?.multiplier.toString() || '50',
          noturna: noturnaRule?.multiplier.toString() || '70',
          domingoFeriado: domingoFeriadoRule?.multiplier.toString() || '100'
        }
      });
    } else {
      setEditingProject(undefined);
    }
    setIsModalOpen(true);
  };

  // ... rest of the component code ...
}