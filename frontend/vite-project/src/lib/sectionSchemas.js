export const SECTION_SCHEMAS = {
  achievements_data: {
    title: 'Achievements',
    itemLabel: 'Achievement',
    emptyState: { title: '', description: '', date: '' },
    fields: [
      { name: 'title', label: 'Achievement Title', type: 'text', placeholder: 'e.g. 1st Place in Hackathon' },
      { name: 'date', label: 'Date', type: 'text', placeholder: 'e.g. 2024 or Dec 2024' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Briefly describe your achievement...' }
    ]
  },
  publications_data: {
    title: 'Publications',
    itemLabel: 'Publication',
    emptyState: { title: '', link: '', date: '', publisher: '' },
    fields: [
      { name: 'title', label: 'Paper Title', type: 'text', placeholder: 'e.g. Machine Learning in IoT' },
      { name: 'publisher', label: 'Publisher / Conference', type: 'text', placeholder: 'e.g. IEEE' },
      { name: 'date', label: 'Date Published', type: 'text', placeholder: 'e.g. 2024-05' },
      { name: 'link', label: 'Link (URL)', type: 'url', placeholder: 'https://doi.org/...' }
    ]
  },
  hackathons_data: {
    title: 'Hackathons',
    itemLabel: 'Hackathon',
    emptyState: { name: '', role: '', project_link: '', description: '', date: '' },
    fields: [
      { name: 'name', label: 'Hackathon Name', type: 'text', placeholder: 'e.g. Smart India Hackathon' },
      { name: 'role', label: 'Role / Team', type: 'text', placeholder: 'e.g. Team Lead / Team ZeroGrid' },
      { name: 'date', label: 'Date', type: 'text', placeholder: 'e.g. 2024' },
      { name: 'project_link', label: 'Project Link (URL)', type: 'url', placeholder: 'https://github.com/...' },
      { name: 'description', label: 'Description / What you built', type: 'textarea', placeholder: 'We built a solution for...' }
    ]
  },
  open_source_data: {
    title: 'Open Source',
    itemLabel: 'Contribution',
    emptyState: { repo_name: '', pr_link: '', description: '' },
    fields: [
      { name: 'repo_name', label: 'Repository Name', type: 'text', placeholder: 'e.g. facebook/react' },
      { name: 'pr_link', label: 'PR / Issue Link', type: 'url', placeholder: 'https://github.com/...' },
      { name: 'description', label: 'What did you contribute?', type: 'textarea', placeholder: 'Fixed a bug in...' }
    ]
  },
  volunteering_data: {
    title: 'Volunteering',
    itemLabel: 'Experience',
    emptyState: { organization: '', role: '', date: '', description: '' },
    fields: [
      { name: 'organization', label: 'Organization Name', type: 'text', placeholder: 'e.g. Red Cross' },
      { name: 'role', label: 'Role', type: 'text', placeholder: 'e.g. Volunteer' },
      { name: 'date', label: 'Date', type: 'text', placeholder: 'e.g. 2022 - 2023' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Organized events for...' }
    ]
  },
  research_data: {
    title: 'Research',
    itemLabel: 'Project',
    emptyState: { title: '', area: '', description: '', link: '' },
    fields: [
      { name: 'title', label: 'Research Title', type: 'text', placeholder: 'e.g. Quantum Computing algorithms' },
      { name: 'area', label: 'Research Area', type: 'text', placeholder: 'e.g. Physics / CS' },
      { name: 'link', label: 'Link (optional)', type: 'url', placeholder: 'https://...' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Researched about...' }
    ]
  },
  education_data: {
    title: 'Education Timeline',
    itemLabel: 'Education',
    emptyState: { institution: '', degree: '', start_date: '', end_date: '', grade: '' },
    fields: [
      { name: 'institution', label: 'Institution Name', type: 'text', placeholder: 'e.g. MIT' },
      { name: 'degree', label: 'Degree / Course', type: 'text', placeholder: 'e.g. B.Tech Computer Science' },
      { name: 'start_date', label: 'Start Date', type: 'text', placeholder: 'e.g. 2020' },
      { name: 'end_date', label: 'End Date', type: 'text', placeholder: 'e.g. 2024 (or Present)' },
      { name: 'grade', label: 'Grade / CGPA', type: 'text', placeholder: 'e.g. 9.5 CGPA' }
    ]
  },
  awards_data: {
    title: 'Awards',
    itemLabel: 'Award',
    emptyState: { title: '', issuer: '', date: '', description: '' },
    fields: [
      { name: 'title', label: 'Award Title', type: 'text', placeholder: 'e.g. Best Developer Award' },
      { name: 'issuer', label: 'Issuer', type: 'text', placeholder: 'e.g. Google' },
      { name: 'date', label: 'Date', type: 'text', placeholder: 'e.g. 2023' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Awarded for...' }
    ]
  },
  testimonials_data: {
    title: 'Testimonials',
    itemLabel: 'Testimonial',
    emptyState: { name: '', position: '', company: '', testimonial: '' },
    fields: [
      { name: 'name', label: 'Person Name', type: 'text', placeholder: 'e.g. John Doe' },
      { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g. Engineering Manager' },
      { name: 'company', label: 'Company', type: 'text', placeholder: 'e.g. TechCorp' },
      { name: 'testimonial', label: 'Testimonial', type: 'textarea', placeholder: 'They said...' }
    ]
  },
  currently_learning: {
    title: 'Currently Learning',
    itemLabel: 'Topic',
    emptyState: { name: '' },
    fields: [
      { name: 'name', label: 'Topic Name', type: 'text', placeholder: 'e.g. Rust, Web3, System Design' }
    ]
  },
  interests: {
    title: 'Interests',
    itemLabel: 'Interest',
    emptyState: { name: '' },
    fields: [
      { name: 'name', label: 'Interest', type: 'text', placeholder: 'e.g. Reading, Hiking, AI' }
    ]
  }
};
