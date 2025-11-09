import Text "mo:base/Text";
import OutCall "http-outcalls/outcall";
import Iter "mo:base/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor ResumeAnalyzer {
  let storage = Storage.new();
  include MixinStorage(storage);

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func get_insights(resume_pdf_bytes : [Nat8], job_level : Text, job_description : Text) : async Text {
    // TODO: ADD EXTERNAL GEMINI API CALL HERE.

    let suggestions = await get_suggestions(job_level, job_description);

    let response = {
      professional_summary = "Your resume is well-structured and highlights relevant experience for the " # job_level # " position.";
      job_specific_keywords = ["TypeScript", "React", "Cloud Deployment"];
      static_resume_info = {
        education = [
          {
            institution = "University of Example";
            degree = "Bachelor of Science in Computer Science";
            graduation_year = 2020;
          },
        ];
        experience = [
          {
            company = "Example Corp";
            position = "Software Engineer";
            duration = "2018-2021";
          },
        ];
        projects = [
          {
            title = "Project Alpha";
            description = "Developed a web application for e-commerce";
            technologies = ["TypeScript", "React", "Node.js"];
          },
        ];
        suggestions;
      };
    };

    // Convert response to JSON string
    let json = "{
      \"professional_summary\": \"" # response.professional_summary # "\",
      \"job_specific_keywords\": [\"" # Text.join("\", \"", Iter.fromArray(response.job_specific_keywords)) # "\"],
      \"static_resume_info\": {
        \"education\": [{
          \"institution\": \"" # response.static_resume_info.education[0].institution # "\",
          \"degree\": \"" # response.static_resume_info.education[0].degree # "\",
          \"graduation_year\": " # debug_show (response.static_resume_info.education[0].graduation_year) # "
        }],
        \"experience\": [{
          \"company\": \"" # response.static_resume_info.experience[0].company # "\",
          \"position\": \"" # response.static_resume_info.experience[0].position # "\",
          \"duration\": \"" # response.static_resume_info.experience[0].duration # "\"
        }],
        \"projects\": [{
          \"title\": \"" # response.static_resume_info.projects[0].title # "\",
          \"description\": \"" # response.static_resume_info.projects[0].description # "\",
          \"technologies\": [\"" # Text.join("\", \"", Iter.fromArray(response.static_resume_info.projects[0].technologies)) # "\"]
        }],
        \"suggestions\": [\"" # Text.join("\", \"", Iter.fromArray(response.static_resume_info.suggestions)) # "\"]
      }
    }";

    json;
  };

  public func get_suggestions(job_level : Text, job_description : Text) : async [Text] {
    // TODO: ADD WEB SCRAPING OR EXTERNAL API FOR JOB SUGGESTIONS.

    [
      "Tailor your resume to match the " # job_level # " requirements.",
      "Highlight relevant experience from the job description.",
      "Use keywords from the job description to improve ATS compatibility.",
      "Showcase measurable achievements in previous roles.",
      "Emphasize skills that match the job requirements",
    ];
  };
};

