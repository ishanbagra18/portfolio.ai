import * as ReactGitHubCalendar from 'react-github-calendar'

const GitHubCalendar = ReactGitHubCalendar.default || ReactGitHubCalendar.GitHubCalendar || ReactGitHubCalendar

export default function GitHubActivity({ githubUsername }) {
  if (!githubUsername) return null

  return (
    <div className="flex flex-col items-center justify-center my-8 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md">
      <h3 className="text-lg font-bold mb-4 text-zinc-200">GitHub Contributions</h3>
      {GitHubCalendar && (
        <GitHubCalendar 
          username={githubUsername} 
          colorScheme="dark"
          fontSize={12}
          blockSize={12}
          blockMargin={4}
        />
      )}
    </div>
  )
}
