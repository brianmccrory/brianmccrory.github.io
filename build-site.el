;; for htmlize.el >= 1.34 required (render source blocks with syntax highlighting)...
(require 'package)
(setq package-user-dir (expand-file-name "./packages"))
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
			 ("elpa" . "https://elpa.gnu.org/packages/")))
(package-initialize)
(unless package-archive-contents
  (package-refresh-contents))
;;(package-install 'htmlize) - not needed for publish to md?

(require 'ox-publish)

(setq org-publish-project-alist
      (list
       (list "brianmccrory.github.io"
	     :recursive t
	     :base-directory "~/git/brianmccrory.github.io"
	     :publishing-function 'org-md-publish-to-md
	     :publishing-directory "."
	     :with-author nil
	     :with-creator nil
	     :with-toc nil
	     :section-numbers nil
	     :time-stamp-file nil)))
;; REF: M-x describe-variable org-publish-project-alias

(org-publish-all t)

(message "Build complete")
