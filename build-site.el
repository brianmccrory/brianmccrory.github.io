;; for htmlize.el >= 1.34 required (render source blocks with syntax highlighting)...
(require 'package)
(setq package-user-dir (expand-file-name "./packages"))
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
			 ("elpa" . "https://elpa.gnu.org/packages/")))
(package-initialize)
(unless package-archive-contents
  (package-refresh-contents))

(package-install 'htmlize)

(require 'ox-publish)

(setq org-html-validation-link nil
      org-html-head-include-scripts nil
      org-html-head-include-default-style nil
      org-html-head "<link rel=\"stylesheet\" href=\"https://cdn.simplecss.org/simple.min.css\" />")

(setq org-publish-project-alist
      (list
       (list "brianmccrory.github.io:main"
	     :recursive t
	     :base-directory "generated"
	     :publishing-function 'org-html-publish-to-html
	     :publishing-directory "_site"
	     :with-author t
	     :with-creator nil
	     :with-toc nil
	     :section-numbers nil
	     :time-stamp-file t)))

(org-publish-all t)

(message "Build complete")
