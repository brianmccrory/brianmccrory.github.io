(require 'package)
(setq package-user-dir (expand-file-name "./packages"))
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
			 ("elpa" . "https://elpa.gnu.org/packages/")))
(package-initialize)
(unless package-archive-contents
  (package-refresh-contents))

(package-install 'ox-hugo)

;;(require 'ox-publish)
;;(require 'ox-hugo)

(with-eval-after-load 'ox-hugo
  (add-to-list 'org-hugo-special-block-type-properties '("html" . (:raw t))))

(defun my/org-hugo-batch-export-all (base-dir section-dir)
  (dolist (file (directory-files-recursively base-dir "\\.org$"))
    (with-current-buffer (find-file-noselect file)
      (org-mode)
      (setq org-hugo-base-dir base-dir)
      (setq org-hugo-default-section-directory section-dir)
      (setq org-hugo-auto-set-lastmod t)
      (let ((org-export-use-babel t))
        (org-hugo-export-wim-to-md :all-subtrees)))))
        
(my/org-hugo-batch-export-all "generated" "resources")

(message "Build complete")
