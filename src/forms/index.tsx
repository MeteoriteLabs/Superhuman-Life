import FitnessTemplate_01 from './templates/fitnessTemplate_01';

function Index(): JSX.Element {
  const selectedTemplate = JSON.parse(localStorage.getItem('selectedTemplate') || '{}');
  const templates = {
    'Fitness Theme 01': <FitnessTemplate_01 />
  };

  return templates[selectedTemplate.name];
}

export default Index;
